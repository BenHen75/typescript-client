import type { EpreuveContract } from '#contracts/epreuve_contract';
import type { HttpClientContract } from '#core/http_client_contract';
import type { TypeEpreuve } from '#enums/type_epreuve';

import { ApiEndpoints } from '#enums/api_endpoints';
import { Division } from '#models/epreuve/division';
import { Epreuve } from '#models/epreuve/epreuve';
import { sourceCollection } from '#utils/source_collection';

export class EpreuveService implements EpreuveContract {
	readonly #httpClient: HttpClientContract;

	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}

	async rechercherDivisionsPourEpreuve(
		idOrganisme: number,
		idEpreuve: number,
		typeEpreuve: TypeEpreuve,
	) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { division: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_DIVISION, {
			organisme: idOrganisme,
			epreuve: idEpreuve,
			type: typeEpreuve,
		});

		return sourceCollection(response, 'division').map(
			(model) => new Division(model),
		);
	}

	async rechercherEpreuves(idOrganisme: number, typeEpreuve: TypeEpreuve) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { epreuve: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_EPREUVE, {
			organisme: idOrganisme,
			type: typeEpreuve,
		});

		return sourceCollection(response, 'epreuve').map(
			(model) => new Epreuve(model),
		);
	}
}
