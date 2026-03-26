import type { ActualitesContract } from '#contracts/actualites_contract';
import type { HttpClientContract } from '#core/http_client_contract';

import { ApiEndpoints } from '#enums/api_endpoints';
import { Actualite } from '#models/divers/actualite';

export class ActualitesService implements ActualitesContract {
	readonly #httpClient: HttpClientContract;

	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}

	async fluxActualitesFederation() {
		const response = await this.#httpClient.fetch<{
			liste: { news: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_NEW_ACTU);

		return response.liste.news.map((model) => new Actualite(model));
	}
}
