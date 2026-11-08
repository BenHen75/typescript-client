import { describe, expect, it } from 'vitest';

import type { RequestParams } from '#core/abstract_http_client';

import { PartieBaseSPID } from '#models/partie/partie_base_spid';
import { JoueurService } from '#services/joueur_service';

describe('official game source models', () => {
	it('preserves textual IDs and complete names with nullable result flags', () => {
		const item = new PartieBaseSPID({
			idpartie: '00077',
			date: '18/10/2026',
			nom: 'Le Gall Jean',
			classement: 'N100',
			victoire: '',
			forfait: '0',
			coefchamp: '1,25',
		});
		expect(item.donneesOfficielles).toMatchObject({
			idPartie: '00077',
			date: '2026-10-18',
			nomAdversaire: 'Le Gall Jean',
			pointsAdversaire: null,
			victoire: null,
			forfait: false,
			coefficient: 1.25,
		});
	});

	it('defers row validation so one invalid date does not discard the entire service response', async () => {
		const service = new JoueurService({
			fetch<Shape extends Record<string, unknown>>(): Promise<Shape> {
				return Promise.resolve({
					liste: {
						partie: [
							{ idpartie: '77', date: '18/10/2026' },
							{ idpartie: '78', date: '31/02/2026' },
						],
					},
				} as unknown as Shape);
			},
		});
		const items = await service.historiquePartiesBaseSPID('00123');
		expect(items).toHaveLength(2);
		expect(items[0]?.donneesOfficielles.idPartie).toBe('77');
		expect(() => items[1]?.donneesOfficielles).toThrow();
	});

	it('requires an explicit opt-in for the retired ranking endpoint and preserves its metadata', async () => {
		const calls: Array<{
			endpoint: string;
			params: RequestParams | undefined;
		}> = [];
		const service = new JoueurService({
			fetch<Shape extends Record<string, unknown>>(
				endpoint: string,
				params?: RequestParams,
			): Promise<Shape> {
				calls.push({ endpoint, params });
				return Promise.resolve({
					liste: {
						partie: {
							licence: '00123',
							advlic: '00456',
							idpartie: '00077',
							advnompre: 'TEST Alex',
							pointres: '-4,125',
							coefchamp: '1,25',
							numjourn: '3',
							vd: 'D',
							forfait: '0',
						},
					},
				} as unknown as Shape);
			},
		});
		await expect(
			service.historiquePartiesBaseClassementLegacy('00123'),
		).rejects.toMatchObject({ code: 'FFTT_LEGACY_ENDPOINT_DISABLED' });
		expect(calls).toHaveLength(0);
		const items = await service.historiquePartiesBaseClassementLegacy('00123', {
			enabled: true,
		});
		expect(calls).toEqual([
			{ endpoint: '/xml_partie_mysql.php', params: { licence: '00123' } },
		]);
		expect(items[0]?.donneesOfficielles).toMatchObject({
			licence: '00123',
			licenceAdversaire: '00456',
			idPartie: '00077',
			pointsObtenus: -4.125,
			coefficient: 1.25,
			numeroJournee: 3,
			victoire: false,
			forfait: false,
		});
	});
});

it('rejects coefficients and official gains beyond the supported three decimal places', async () => {
	expect(
		() => new PartieBaseSPID({ coefchamp: '1.1234' }).donneesOfficielles,
	).toThrow();
	const service = new JoueurService({
		fetch<Shape extends Record<string, unknown>>(): Promise<Shape> {
			return Promise.resolve({
				liste: { partie: { pointres: '5.1234' } },
			} as unknown as Shape);
		},
	});
	const items = await service.historiquePartiesBaseClassementLegacy('00123', {
		enabled: true,
	});
	expect(() => items[0]?.donneesOfficielles).toThrow();
});
