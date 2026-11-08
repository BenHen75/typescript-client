import { XMLParser, XMLValidator } from 'fast-xml-parser';
import sha1 from 'jssha/sha1';
import { DateTime } from 'luxon';
import md5 from 'md5';

import type { RequestParams } from '#core/abstract_http_client';

import { ApiEndpoints } from '#enums/api_endpoints';
import { FfttError } from '#errors/fftt_error';

export type Credentials = { appId: string; appKey: string; serial: string };
export type TransportOptions = {
	timeoutMs?: number;
	maxResponseBytes?: number;
};
const endpoints = new Set<string>(Object.values(ApiEndpoints));

export function signedUrl(
	endpoint: string,
	params: RequestParams,
	credentials: Credentials,
	now = new Date(),
): URL {
	if (!endpoints.has(endpoint))
		throw new FfttError('FFTT_ENDPOINT_NOT_SUPPORTED');
	const tm = DateTime.fromJSDate(now, { zone: 'Europe/Paris' }).toFormat(
		'yyyyLLddHHmmss',
	);
	const signature = new sha1('SHA-1', 'TEXT', {
		hmacKey: {
			value: md5(credentials.appKey),
			format: 'TEXT',
			// oxlint-disable-next-line unicorn/text-encoding-identifier-case
			encoding: 'UTF8',
		},
		// oxlint-disable-next-line unicorn/text-encoding-identifier-case
		encoding: 'UTF8',
	});
	signature.update(tm);
	const url = new URL(`https://apiv2.fftt.com/mobile/pxml${endpoint}`);
	for (const [key, value] of Object.entries(params))
		if (value !== undefined) url.searchParams.set(key, String(value));
	for (const [key, value] of Object.entries({
		serie: credentials.serial,
		id: credentials.appId,
		tm,
		tmc: signature.getHMAC('HEX'),
	}))
		url.searchParams.set(key, value);
	return url;
}

export function decodeFfttXml(bytes: Uint8Array): string {
	try {
		return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
	} catch {
		return new TextDecoder('iso-8859-1').decode(bytes);
	}
}

export function parseFfttXml(bytes: Uint8Array): Record<string, unknown> {
	const xml = decodeFfttXml(bytes);
	if (/<!DOCTYPE|<!ENTITY/i.test(xml) || XMLValidator.validate(xml) !== true)
		throw new FfttError('FFTT_INVALID_XML');
	const data: unknown = new XMLParser({
		ignoreDeclaration: true,
		parseTagValue: false,
	}).parse(xml);
	if (!data || typeof data !== 'object' || Array.isArray(data))
		throw new FfttError('FFTT_INVALID_XML');
	const response = data as Record<string, unknown>;
	if (
		'erreur' in response ||
		(response['liste'] &&
			typeof response['liste'] === 'object' &&
			'erreur' in response['liste'])
	)
		throw new FfttError('FFTT_REJECTED');
	const initialization = response['initialisation'];
	if (
		!('liste' in response) &&
		(!initialization ||
			typeof initialization !== 'object' ||
			Array.isArray(initialization))
	)
		throw new FfttError('FFTT_INVALID_RESPONSE');
	return response;
}

export async function requestFftt(
	url: URL,
	fetcher: typeof fetch = fetch,
	options: TransportOptions = {},
): Promise<Record<string, unknown>> {
	try {
		const response = await fetcher(url, {
			method: 'GET',
			cache: 'no-store',
			redirect: 'error',
			signal: AbortSignal.timeout(options.timeoutMs ?? 20_000),
		});
		if (!response.ok) {
			await response.body?.cancel();
			const header = response.headers.get('Retry-After');
			const seconds = header
				? /^\d+$/.test(header)
					? Number(header)
					: Math.ceil((Date.parse(header) - Date.now()) / 1000)
				: undefined;
			throw new FfttError(
				response.status === 429 ? 'FFTT_RATE_LIMITED' : 'FFTT_HTTP_ERROR',
				seconds && Number.isFinite(seconds) && seconds > 0
					? seconds
					: undefined,
				response.status,
			);
		}
		const reader = response.body?.getReader();
		if (!reader) throw new FfttError('FFTT_EMPTY_RESPONSE');
		const chunks: Array<Uint8Array> = [];
		let size = 0;
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			size += value.length;
			if (size > (options.maxResponseBytes ?? 2_000_000)) {
				await reader.cancel();
				throw new FfttError('FFTT_RESPONSE_TOO_LARGE');
			}
			chunks.push(value);
		}
		const bytes = new Uint8Array(size);
		let offset = 0;
		for (const chunk of chunks) {
			bytes.set(chunk, offset);
			offset += chunk.length;
		}
		return parseFfttXml(bytes);
	} catch (error) {
		if (error instanceof FfttError) throw error;
		throw new FfttError('FFTT_NETWORK_ERROR');
	}
}
