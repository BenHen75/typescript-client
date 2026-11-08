import { describe, expect, it, vi } from 'vitest';

import type { HttpClientContract } from '#core/http_client_contract';

import { DetailClub } from '#models/club/detail_club';
import { EquipePoule } from '#models/epreuve/par_equipes/poule/equipe_poule';
import { JoueurRencontre } from '#models/epreuve/par_equipes/rencontre/joueur_rencontre';
import { PartieRencontre } from '#models/epreuve/par_equipes/rencontre/partie_rencontre';
import { Rencontre } from '#models/epreuve/par_equipes/rencontre/rencontre';
import { ResultatRencontre } from '#models/epreuve/par_equipes/rencontre/resultat_rencontre';
import { EpreuveParEquipeService } from '#services/epreuve_par_equipe_service';
import {
	parseFfttDate,
	parseFfttSets,
	parseSheetClassification,
} from '#utils/match_source';

describe('civil dates and source presence', () => {
	it('keeps missing dates missing and rejects impossible dates', () => {
		expect(parseFfttDate('29/02/2024')).toBe('2024-02-29');
		expect(parseFfttDate('2026-10-18')).toBe('2026-10-18');
		for (const value of [undefined, null, '', '00/00/0000'])
			expect(parseFfttDate(value)).toBeNull();
		for (const value of ['31/02/2026', '2026-13-01', '1/2/2026', 0])
			expect(() => parseFfttDate(value)).toThrow('FFTT_INVALID_DATE');
		const omitted = new Rencontre({ lien: 'renc_id=61' });
		expect(omitted.datePrevueIso).toBeUndefined();
		expect(omitted.datePrevue).toBeUndefined();
		expect(omitted.dateReelle).toBeUndefined();
		expect(omitted.idPoule).toBeUndefined();
		expect(
			new Rencontre({ dateprevue: '', lien: 'renc_id=61' }).datePrevueIso,
		).toBeNull();
		expect(() => new Rencontre({ dateprevue: '31/02/2026' })).toThrow(
			'FFTT_INVALID_DATE',
		);
	});

	it('preserves omitted, cleared and zero venue fields', () => {
		const omitted = new DetailClub({ numero: '00123456', nom: 'Club' });
		expect(omitted.siteInternetSource).toBeUndefined();
		expect(omitted.dateValidationIso).toBeUndefined();
		expect(omitted.salleSource).toBeUndefined();
		const partial = new DetailClub({
			numero: '00123456',
			nomsalle: 'Salle',
			web: '',
			validation: '',
			latitude: '0',
			longitude: '-1,25',
			adressesalle1: '',
		});
		expect(partial.siteInternetSource).toBeNull();
		expect(partial.dateValidationIso).toBeNull();
		expect(partial.salleSource).toEqual({
			nom: 'Salle',
			ligneAdresse1: null,
			ligneAdresse2: undefined,
			ligneAdresse3: undefined,
			codePostal: undefined,
			ville: undefined,
			latitude: 0,
			longitude: -1.25,
		});
		expect(
			() => new DetailClub({ validation: '31/02/2026' }).dateValidationIso,
		).toThrow('FFTT_INVALID_DATE');
	});
});

describe('match scores and access context', () => {
	it('distinguishes unknown match scores, lost games and actual zeros', () => {
		expect(new Rencontre({ scorea: '-', scoreb: '0' }).scoreEquipeA).toBeNull();
		expect(new Rencontre({ scorea: '-', scoreb: '0' }).scoreEquipeB).toBe(0);
		expect(new Rencontre({}).scoreEquipeA).toBeUndefined();
		expect(new ResultatRencontre({ resa: '0', resb: '' }).scoreA).toBe(0);
		expect(new ResultatRencontre({ resa: '0', resb: '' }).scoreB).toBeNull();
		expect(new PartieRencontre({ scorea: '1', scoreb: '-' }).scoreB).toBe(0);
		expect(new PartieRencontre({ scorea: '' }).scoreA).toBeNull();
		expect(new PartieRencontre({}).scoreA).toBeUndefined();
		for (const scorea of ['NaN', '-1', '1.5', {}, Infinity])
			expect(() => new Rencontre({ scorea })).toThrow('FFTT_INVALID_SCORE');
	});

	it('retains absent query parameters for caller context fallback', () => {
		const item = new Rencontre({
			lien: 'renc_id=61&phase=&res_1=&res_2=0&equip_id1=51&equip_id2=0',
		});
		expect(item.id).toBe(61);
		expect(item.parametresAccesAuDetail.phase).toBeUndefined();
		expect(item.parametresAccesAuDetail.res_1).toBeUndefined();
		expect(item.parametresAccesAuDetail.res_2).toBe(0);
		expect(item.parametresAccesAuDetail.equip_id2).toBe(0);
		expect(item.parametresAccesAuDetail.is_retour).toBeUndefined();
	});
});

describe('rankings and initial order', () => {
	it('supports the current clt field and the legacy classement field', () => {
		expect(
			new EquipePoule({ clt: '2', classement: '3', numero: '00850144' })
				.classement,
		).toBe(2);
		expect(new EquipePoule({ classement: '3' }).classement).toBe(3);
		expect(new EquipePoule({ pos: 2 }).positionDepart).toBe(2);
		expect(new EquipePoule({ numero: '00850144' }).numeroClub).toBe('00850144');
	});

	it('returns the source initial order through the SDK model', async () => {
		const fetch = vi.fn().mockResolvedValue({
			liste: { classement: [{ idequipe: '52' }, { idequipe: '51' }] },
		});
		const service = new EpreuveParEquipeService({
			fetch,
		} as unknown as HttpClientContract);
		const rows = await service.ordrePoule(31, 41);
		expect(rows.map((row) => [row.idEquipe, row.positionDepart])).toEqual([
			[52, 1],
			[51, 2],
		]);
	});
});

describe('sheet player classifications and sets', () => {
	it('parses gender, zero and decimal points with or without spaces', () => {
		for (const value of ['M1240pts', 'M 1240pts', '1240'])
			expect(parseSheetClassification(value).points).toBe(1240);
		expect(parseSheetClassification('F 0pts')).toEqual({
			gender: 'F',
			points: 0,
		});
		expect(parseSheetClassification('N° 123 M 2500,5pts')).toEqual({
			gender: 'M',
			points: 2500.5,
		});
		const player = new JoueurRencontre({
			xja: 'DUPONT Luc',
			xjb: 'MARTIN Lea',
			xca: 'M1240pts',
			xcb: 'F 0pts',
		});
		expect(player.sexeA?.code).toBe('M');
		expect(player.pointsOfficielsA).toBe(1240);
		expect(player.sexeB?.code).toBe('F');
		expect(player.pointsOfficielsB).toBe(0);
	});

	it('keeps minus zero, whitespace and point scores separate from game scores', () => {
		expect(parseFfttSets('-0  9\t-10')).toEqual([
			[0, 11],
			[11, 9],
			[10, 12],
		]);
		for (const text of ['', ' ', '-']) expect(parseFfttSets(text)).toEqual([]);
		expect(() => parseFfttSets('9 invalid')).toThrow('FFTT_INVALID_SETS');
		expect(() => new PartieRencontre({ detail: { invalid: '9' } })).toThrow(
			'FFTT_INVALID_DATA',
		);
		const game = new PartieRencontre({
			scorea: '1',
			scoreb: '-',
			detail: '-0  9\t-10',
		});
		expect(game.scoreA).toBe(1);
		expect(game.scoreB).toBe(0);
		expect(game.detailManchesComplet).toEqual([
			[0, 11],
			[11, 9],
			[10, 12],
		]);
		expect(Object.is(game.detailManches[0], -0)).toBe(true);
	});
});
