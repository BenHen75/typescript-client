import sha1 from 'jssha/sha1';
import { DateTime } from 'luxon';
import md5 from 'md5';

import type { HttpClientContract } from '#core/http_client_contract';
import type { ApiEndpoint } from '#enums/api_endpoints';

import {
	AbstractHttpClient,
	type RequestParams,
} from '#core/abstract_http_client';
import { HttpError } from '#errors/http_error';

export class HttpClient
	extends AbstractHttpClient
	implements HttpClientContract
{
	constructor(appId: string, appKey: string, serial: string) {
		super();

		this.appId = appId;
		this.appKey = appKey;
		this.serial = serial;
		this.time = DateTime.now().toFormat('yyyyLLddHHmmss');

		const sha = new sha1('SHA-1', 'TEXT', {
			hmacKey: {
				value: md5(this.appKey),
				format: 'TEXT',
				// oxlint-disable-next-line unicorn/text-encoding-identifier-case
				encoding: 'UTF8',
			},
			// oxlint-disable-next-line unicorn/text-encoding-identifier-case
			encoding: 'UTF8',
		});

		sha.update(this.time);

		this.tmc = sha.getHMAC('HEX');
	}

	// oxlint-disable-next-line typescript/no-explicit-any
	async fetch<Shape extends Record<string, any>>(
		endpoint: ApiEndpoint,
		requestParams?: RequestParams,
	) {
		const { response, httpCode } = await this.#executeCall(
			endpoint,
			requestParams,
		);

		const sanitized = this.sanitizeResponse(response);

		const payload = this.convertXmlToObject<Shape>(sanitized);

		if (httpCode !== 200) {
			throw new HttpError(payload['erreur'] as string);
		}

		return payload;
	}

	async #executeCall(endpoint: ApiEndpoint, requestParams?: RequestParams) {
		const requestParameters = new URLSearchParams({
			serie: this.serial,
			id: this.appId,
			tm: this.time,
			tmc: this.tmc,
		});

		if (requestParams) {
			for (const [key, value] of Object.entries(requestParams)) {
				requestParameters.append(key, String(value));
			}
		}

		const url = new URL(this.baseUrl + endpoint);
		url.search = requestParameters.toString();

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			redirect: 'follow',
		});

		return {
			response: await response.arrayBuffer(),
			httpCode: response.status,
		};
	}
}
