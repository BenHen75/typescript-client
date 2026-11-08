import { describe, expect, it } from 'vitest';

import { Classement } from '#models/epreuve/individuelle/classement';
import { Groupe } from '#models/epreuve/individuelle/groupe';
import { Partie } from '#models/epreuve/individuelle/partie';
import { EpreuveIndividuelleService } from '#services/epreuve_individuelle_service';
import { EpreuveService } from '#services/epreuve_service';

const client = (response: Record<string, unknown>) => ({
	fetch<Shape extends Record<string, unknown>>() {
		return Promise.resolve(structuredClone(response) as Shape);
	},
});
const service = (response: Record<string, unknown>) =>
	new EpreuveIndividuelleService(client(response));
const group = {
	libelle: 'T1',
	date: '10/10/2026',
	lien: 'epr=12&res_division=23&cx_tableau=34',
};
const standing = {
	rang: '1',
	nom: 'DU TEST',
	clt: '1523',
	club: 'Club',
	points: '0',
};

describe('individual source identities', () => {
	it('preserves surname-only and full labels alongside parsed name fields', () => {
		const surname = new Classement(standing);
		expect(surname.nomComplet).toBe('DU TEST');
		expect(`${surname.nom} ${surname.prenom}`.trim()).toBe('DU TEST');
		expect(surname.classementBrut).toBe('1523');
		expect(surname.pointsCriterium).toBe('0');
		expect(surname.numerote).toBe(false);
		const full = new Classement({ ...standing, nom: 'DU TEST Alex' });
		expect(full.nomComplet).toBe('DU TEST Alex');
		expect(full.nom).toBe('DU TEST');
		expect(full.prenom).toBe('Alex');
	});

	it('preserves licence zeros and rejects conflicting or malformed source licences', () => {
		expect(
			new Classement({
				...standing,
				licence: '00123',
				numlic: '00123',
				idlicence: '789',
			}).licenceSource,
		).toBe('00123');
		expect(
			new Classement({ ...standing, idlicence: '789' }).licenceSource,
		).toBeUndefined();
		expect(
			() => new Classement({ ...standing, licence: '00123', numlic: '00456' }),
		).toThrow();
		expect(() => new Classement({ ...standing, licence: 'invalid' })).toThrow();
		expect(new Classement({ ...standing, rang: '0' }).rang).toBeNull();
		expect(() => new Classement({ ...standing, rang: '-1' })).toThrow();
	});

	it.each([
		['0', false],
		['1', true],
		['(F)', true],
		['', null],
		[undefined, null],
	] as const)('distinguishes forfait %s', (forfait, expected) => {
		const input = {
			libelle: 'Finale',
			vain: 'TEST Alice',
			perd: 'ADVERSE Bob',
			...(forfait === undefined ? {} : { forfait }),
		};
		const row = new Partie(input);
		expect(row.gagneParForfait).toBe(expected);
		expect(row.nomCompletGagnant).toBe('TEST Alice');
		expect(row.nomCompletPerdant).toBe('ADVERSE Bob');
	});

	it('rejects unknown forfait flags', () => {
		expect(() => new Partie({ forfait: 'unknown' })).toThrow();
	});
});

describe('individual services', () => {
	it('accepts singleton, array and empty collections through the public methods', async () => {
		const single = await service({
			liste: { classement: standing },
		}).recupererClassement(12, 23, 34);
		expect(single[0]?.nomComplet).toBe(standing.nom);
		const multiple = await service({
			liste: { classement: [standing] },
		}).recupererClassementCriterium(23);
		expect(multiple[0]?.pointsCriterium).toBe('0');
		expect(await service({ liste: '' }).recupererParties(12, 23, 34)).toEqual(
			[],
		);
		expect(
			await service({ liste: { partie: '' } }).recupererParties(12, 23, 34),
		).toEqual([]);
		await expect(
			service({ liste: {} }).recupererClassement(12, 23, 34),
		).rejects.toThrow();
	});

	it('validates group context and repeated identifiers before returning groups', async () => {
		const [result] = await service({
			liste: { tour: group },
		}).rechercherGroupes(12, 23);
		expect(result?.id).toBe(34);
		expect(result?.dateISO).toBe('2026-10-10');
		await expect(
			service({ liste: { tour: group } }).rechercherGroupes(13, 23),
		).rejects.toMatchObject({ code: 'FFTT_INDIVIDUAL_CONTEXT_MISMATCH' });
		expect(
			() => new Groupe({ ...group, lien: `${group.lien}&epr=12` }),
		).toThrow();
		expect(
			() => new Groupe({ ...group, lien: `${group.lien}#invalid` }),
		).toThrow();
		expect(() => new Groupe({ ...group, date: '31/02/2026' })).toThrow();
		expect(new Groupe({ ...group, date: '' }).dateISO).toBeNull();
		expect(new Groupe({ ...group, date: '00/00/0000' }).date).toBeNull();
	});

	it('uses the existing event and division methods for singleton catalogues', async () => {
		const events = new EpreuveService(
			client({
				liste: {
					epreuve: {
						idepreuve: '12',
						idorga: '89',
						libelle: 'Critérium',
						typepreuve: 'C',
					},
				},
			}),
		);
		const catalogue = await events.rechercherEpreuves(89, 'I');
		expect(catalogue[0]?.type.code).toBe('C');
		const divisions = new EpreuveService(
			client({ liste: { division: { iddivision: '23', libelle: 'D1' } } }),
		);
		const entries = await divisions.rechercherDivisionsPourEpreuve(89, 12, 'I');
		expect(entries[0]?.id).toBe(23);
	});
});
