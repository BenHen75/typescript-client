import { describe, expect, it } from 'vitest';

import type { RequestParams } from '#core/abstract_http_client';

import { DetailJoueur } from '#models/joueur/detail_joueur';
import { JoueurBaseSPID } from '#models/joueur/joueur_base_spid';
import { JoueurService } from '#services/joueur_service';

function source(payload: Record<string, unknown>) {
	const calls: Array<{ endpoint: string; params: RequestParams | undefined }> =
		[];
	const service = new JoueurService({
		fetch<Shape extends Record<string, unknown>>(
			endpoint: string,
			params?: RequestParams,
		): Promise<Shape> {
			calls.push({ endpoint, params });
			return Promise.resolve(payload as Shape);
		},
	});
	return { service, calls };
}

describe('member source models', () => {
	it('keeps zero points, field absence, unknown public codes and the correct internal ID', () => {
		const item = new DetailJoueur({
			idlicence: '123',
			licence: '00123',
			nom: 'TEST',
			prenom: 'Alex',
			point: '0',
			pointm: '0',
			apointm: '',
			initm: '976,5',
			cat: 'NEW_CATEGORY',
			certif: 'UNKNOWN',
			natio: 'NEW_NATIONALITY',
		});
		expect(item.id).toBe(123);
		expect(item.pointsMensuels).toBe(0);
		expect(item.donneesPubliques).toMatchObject({
			licence: '00123',
			pointsOfficiels: 0,
			pointsMensuels: 0,
			pointsMensuelsPrecedents: null,
			valeurInitiale: 976.5,
			categorie: 'NEW_CATEGORY',
			nationalite: 'NEW_NATIONALITY',
			dateValidation: undefined,
		});
	});

	it('normalizes both observed SPID club layouts without guessing from a club name', () => {
		for (const fields of [
			{ club: '12850143', nclub: 'Example Club' },
			{ club: 'Example Club', nclub: '12850143' },
		]) {
			const player = new JoueurBaseSPID({
				...fields,
				licence: '00123',
				nom: 'TEST',
				prenom: 'Alex',
				points: '0',
			});
			expect(player.numeroClub).toBe('12850143');
			expect(player.club).toBe('Example Club');
			expect(player.donneesPubliques).toMatchObject({
				numeroClub: '12850143',
				pointsOfficiels: 0,
				sexe: undefined,
			});
		}
		expect(
			new JoueurBaseSPID({ club: 'Example Club' }).donneesPubliques.numeroClub,
		).toBeUndefined();
	});

	it('uses numlic for ranking history and handles a singleton without transport-specific rewriting', async () => {
		const { service, calls } = source({
			liste: {
				histo: { saison: '20262027', phase: '1', point: '0', place: '0' },
			},
		});
		const result = await service.historiqueClassementOfficiel('00123');
		expect(calls).toEqual([
			{ endpoint: '/xml_histo_classement.php', params: { numlic: '00123' } },
		]);
		expect(result[0]?.donneesOfficielles).toEqual({
			saison: '20262027',
			phase: 1,
			echelon: undefined,
			rang: 0,
			points: 0,
		});
	});

	it('accepts valid empty lists but rejects incomplete envelopes', async () => {
		expect(
			await source({ liste: '' }).service.joueursParClub('12850143'),
		).toEqual([]);
		await expect(
			source({ liste: {} }).service.joueursParClub('12850143'),
		).rejects.toMatchObject({ code: 'FFTT_INVALID_RESPONSE' });
	});
});

it('rejects excess decimal precision in source points rather than rounding at persistence', () => {
	for (const field of ['point', 'pointm', 'apointm', 'initm']) {
		const item = new DetailJoueur({ [field]: '1000.1234' });
		expect(() => item.donneesPubliques).toThrow();
	}
	expect(
		() => new JoueurBaseSPID({ points: '1000.1234' }).donneesPubliques,
	).toThrow();
});
