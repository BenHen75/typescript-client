/* oxlint-disable typescript/require-await */
import { createHash, createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import {
	FFTTApi,
	FfttError,
	parseFfttXml,
	requestFftt,
	signedUrl,
} from '#/index';
import { parseClassementJoueur, separerNomPrenom } from '#utils/joueur_utils';
import { numberIfDefined } from '#utils/value_transformer';

const credentials = {
	appId: 'test',
	appKey: 'fixture',
	serial: 'abcdefghijklmno',
};
const bytes = (xml: string) => new TextEncoder().encode(xml);

describe('signed, bounded FFTT transport', () => {
	it('preserves the authentication endpoint root outside liste', async () => {
		const api = FFTTApi.create(
			credentials.appId,
			credentials.appKey,
			credentials.serial,
			{
				fetcher: async () =>
					new Response('<initialisation><appli>1</appli></initialisation>'),
			},
		);
		expect(await api.authentification.authentifier()).toBe(true);
	});
	it('renews the Paris signature, omits undefined parameters and preserves textual IDs', () => {
		const url = signedUrl(
			'/xml_licence_b.php',
			{ club: '00123456', absent: undefined },
			credentials,
			new Date('2026-10-24T10:00:00Z'),
		);
		expect(url.searchParams.get('tm')).toBe('20261024120000');
		expect(url.searchParams.get('tmc')).toBe(
			createHmac('sha1', createHash('md5').update('fixture').digest('hex'))
				.update('20261024120000')
				.digest('hex'),
		);
		expect(url.searchParams.get('club')).toBe('00123456');
		expect(url.searchParams.has('absent')).toBe(false);
		expect(
			signedUrl(
				'/xml_licence_b.php',
				{},
				credentials,
				new Date('2026-10-24T10:00:01Z'),
			).searchParams.get('tmc'),
		).not.toBe(url.searchParams.get('tmc'));
		expect(() => signedUrl('https://example.com', {}, credentials)).toThrow(
			'FFTT_ENDPOINT_NOT_SUPPORTED',
		);
	});
	it('decodes UTF-8 and Latin1 without decoding escaped markup twice', () => {
		const xml =
			'<?xml version="1.0" encoding="ISO-8859-1"?><liste><nom>Bréti &amp; &lt;club&gt;</nom><points>0</points></liste>';
		for (const source of [bytes(xml), Buffer.from(xml, 'latin1')])
			expect(parseFfttXml(source)).toEqual({
				liste: { nom: 'Bréti & <club>', points: '0' },
			});
	});
	it('rejects malformed responses and XML errors with status 200', async () => {
		for (const xml of [
			'<erreur>PRIVATE</erreur>',
			'<liste><erreur>PRIVATE</erreur></liste>',
			'<html>PRIVATE</html>',
			'<liste><club>',
			'<!DOCTYPE a><liste/>',
		]) {
			await expect(
				requestFftt(
					new URL('https://example.com'),
					async () => new Response(xml),
				),
			).rejects.toBeInstanceOf(FfttError);
		}
	});
	it('preserves Retry-After and HTTP status without exposing the server message', async () => {
		await expect(
			requestFftt(
				new URL('https://example.com'),
				async () =>
					new Response('PRIVATE', {
						status: 429,
						headers: { 'Retry-After': '7200' },
					}),
			),
		).rejects.toMatchObject({
			code: 'FFTT_RATE_LIMITED',
			httpStatus: 429,
			retryAfterSeconds: 7200,
			message: 'FFTT_RATE_LIMITED',
		});
	});
	it('bounds response size and configures a timeout and redirect rejection', async () => {
		await expect(
			requestFftt(
				new URL('https://example.com'),
				async (_url, init) => {
					expect(init?.redirect).toBe('error');
					expect(init?.signal).toBeInstanceOf(AbortSignal);
					return new Response('x'.repeat(100));
				},
				{ maxResponseBytes: 50 },
			),
		).rejects.toMatchObject({ code: 'FFTT_RESPONSE_TOO_LARGE' });
	});
	it('uses one request and one quota reservation for a complete organization tree', async () => {
		let calls = 0,
			reservations = 0;
		const api = FFTTApi.create(
			credentials.appId,
			credentials.appKey,
			credentials.serial,
			{
				beforeRequest: async () => {
					reservations++;
				},
				fetcher: async () => {
					calls++;
					return new Response(
						'<liste>' +
							['F', 'Z', 'L', 'D']
								.map(
									(kind, index) =>
										`<organisme><id>${index + 1}</id><code>${kind}01</code><libelle>Org ${kind}</libelle><idPere>0</idPere></organisme>`,
								)
								.join('') +
							'</liste>',
					);
				},
			},
		);
		for (const kind of ['F', 'Z', 'L', 'D'] as const)
			expect(await api.organisme.organismesParType(kind)).toHaveLength(1);
		expect(calls).toBe(1);
		expect(reservations).toBe(1);
	});
	it('allows a reusable client to recover after a transient request failure', async () => {
		let calls = 0;
		const api = FFTTApi.create(
			credentials.appId,
			credentials.appKey,
			credentials.serial,
			{
				fetcher: async () => {
					calls++;
					return calls === 1
						? new Response('', { status: 503 })
						: new Response('<liste/>');
				},
			},
		);
		await expect(api.epreuve.rechercherEpreuves(1, 'C')).rejects.toMatchObject({
			code: 'FFTT_HTTP_ERROR',
		});
		expect(await api.epreuve.rechercherEpreuves(1, 'C')).toEqual([]);
		expect(calls).toBe(2);
	});

	it('allows a failed organization discovery to be retried', async () => {
		let calls = 0;
		const api = FFTTApi.create(
			credentials.appId,
			credentials.appKey,
			credentials.serial,
			{
				fetcher: async () => {
					calls++;
					return calls === 1
						? new Response('', { status: 503 })
						: new Response('<liste/>');
				},
			},
		);
		await expect(api.organisme.organismesParType('F')).rejects.toMatchObject({
			code: 'FFTT_HTTP_ERROR',
		});
		expect(await api.organisme.organismesParType('F')).toEqual([]);
		expect(calls).toBe(5);
	});

	it('stops the queued requests after the first transport failure', async () => {
		let calls = 0;
		const api = FFTTApi.create(
			credentials.appId,
			credentials.appKey,
			credentials.serial,
			{
				stopAfterFailure: true,
				fetcher: async () => {
					calls++;
					return new Response('PRIVATE', { status: 429 });
				},
			},
		);
		await expect(api.organisme.organismesParType('F')).rejects.toMatchObject({
			code: 'FFTT_RATE_LIMITED',
		});
		await expect(api.epreuve.rechercherEpreuves(1, 'C')).rejects.toMatchObject({
			code: 'FFTT_RATE_LIMITED',
		});
		expect(calls).toBe(1);
	});
});

describe('lossless scalar conversion', () => {
	it('retains zero and keeps unknown first names empty', () => {
		expect(numberIfDefined('0')).toBe(0);
		expect(numberIfDefined('0', false)).toBeUndefined();
		expect(separerNomPrenom('DU TEST')).toEqual(['DU TEST', '']);
		expect(separerNomPrenom('DU TEST Alex')).toEqual(['DU TEST', 'Alex']);
		expect(parseClassementJoueur('M1240pts')).toMatchObject({
			points: 1240,
			sexe: 'M',
		});
	});
});
