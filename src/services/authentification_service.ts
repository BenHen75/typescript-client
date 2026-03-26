import type { AuthentificationContract } from '#contracts/authentification_contract';
import type { HttpClientContract } from '#core/http_client_contract';

import { ApiEndpoints } from '#enums/api_endpoints';
import { Initialisation } from '#models/divers/initialisation';

export class AuthentificationService implements AuthentificationContract {
	readonly #httpClient: HttpClientContract;

	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}

	async authentifier() {
		const response = await this.#httpClient.fetch<{
			initialisation: Record<string, unknown>;
		}>(ApiEndpoints.XML_INITIALISATION);

		return new Initialisation(response.initialisation).appli;
	}
}
