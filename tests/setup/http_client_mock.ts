import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { HttpClientContract } from '#core/http_client_contract';

import {
	AbstractHttpClient,
	type RequestParams,
} from '#core/abstract_http_client';
import { type ApiEndpoint } from '#enums/api_endpoints';
import { HttpError } from '#errors/http_error';

import mocks from '../../../snapshots/mocks.json' with { type: 'json' };

interface Mock {
	endpoint: string;
	params: Record<string, string | boolean>;
	snapshot: string;
	http_code: number;
}

export class HttpClientMock
	extends AbstractHttpClient
	implements HttpClientContract
{
	constructor(appId: string, appKey: string, serial: string) {
		super();

		this.appId = appId ?? '1234';
		this.appKey = appKey ?? 'abcde';
		this.serial = serial ?? '1234';
		this.time = '';
		this.tmc = '';
	}

	// oxlint-disable-next-line typescript/no-explicit-any
	async fetch<Shape extends Record<string, any>>(
		endpoint: ApiEndpoint,
		requestParams?: RequestParams,
	) {
		const { response, httpCode } = await this.#executeCall(
			endpoint,
			requestParams ?? {},
		);

		const sanitized = this.sanitizeResponse(response);

		const payload = this.convertXmlToObject<Shape>(sanitized);

		if (httpCode !== 200) {
			throw new HttpError(payload['erreur'] as string);
		}

		return payload;
	}

	async #executeCall(endpoint: ApiEndpoint, requestParams: RequestParams) {
		const requestParameters = new URLSearchParams({
			serie: this.serial,
			id: this.appId,
			tm: this.time,
			tmc: this.tmc,
		});

		for (const [key, value] of Object.entries(requestParams)) {
			requestParameters.append(key, String(value));
		}

		const mock = this.#getMock(endpoint, requestParameters);

		return {
			response: await this.#getMockFile(mock),
			httpCode: mock.http_code,
		};
	}

	#getMockFile(mock: Mock) {
		const filePath = path.resolve(
			path.dirname(fileURLToPath(import.meta.url)),
			`../../../snapshots/snapshots/${mock.snapshot}`,
		);

		return readFile(filePath);
	}

	#getMock(endpoint: ApiEndpoint, requestParams: URLSearchParams): Mock {
		const mock = mocks.find((mock) => {
			if (`/${mock.endpoint}` !== endpoint) {
				return false;
			}

			if (Object.entries(mock.params).length === 0) {
				return true;
			}

			const valid: Array<boolean> = [];

			for (const [key, value] of Object.entries(mock.params)) {
				const exists = requestParams.has(key);

				if (value === true && exists) {
					valid.push(true);
				} else if (value === false && !exists) {
					valid.push(true);
				} else if (exists && value === requestParams.get(key)) {
					valid.push(true);
				} else {
					valid.push(false);
				}
			}

			return valid.every(Boolean);
		});

		if (!mock) {
			throw new Error(
				`Mock not found for endpoint ${endpoint} and params ${JSON.stringify(requestParams)}`,
			);
		}

		return mock;
	}
}
