import type { OrganismeContract } from '#contracts/organisme_contract';
import type { HttpClientContract } from '#core/http_client_contract';

import { ApiEndpoints } from '#enums/api_endpoints';
import { TypeOrganisme } from '#enums/type_organisme';
import { Organisme } from '#models/organisme/organisme';

export class OrganismeService implements OrganismeContract {
	readonly #httpClient: HttpClientContract;

	#organismes: Array<Organisme> = [];

	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}

	async organisme(code: string) {
		await this.#remplirOrganismes();

		return this.#organismes.find((organisme) => organisme.code === code);
	}

	async organismesEnfants(code: string) {
		await this.#remplirOrganismes();

		const parent = this.#organismes.find(
			(organisme) => organisme.code === code,
		);

		if (!parent?.id) {
			return [];
		}

		return this.#organismes.filter(
			(organisme) => organisme.idOrganismeParent === parent.id,
		);
	}

	async organismesParType(orgType: TypeOrganisme) {
		await this.#remplirOrganismes();

		return this.#organismes.filter(
			(organisme) => organisme.type.code === orgType,
		);
	}

	async #remplirOrganismes() {
		if (this.#organismes.length > 0) {
			return;
		}

		const promises = [];

		for (const type of Object.values(TypeOrganisme)) {
			promises.push(async () => {
				const response = await this.#httpClient.fetch<{
					liste: {
						organisme: Record<string, unknown> | Array<Record<string, unknown>>;
					};
				}>(ApiEndpoints.XML_ORGANISME, { type });

				if (Array.isArray(response.liste.organisme)) {
					return response.liste.organisme.map((model) => new Organisme(model));
				}

				return [new Organisme(response.liste.organisme)];
			});
		}

		const results = await Promise.all(promises.map((promise) => promise()));

		for (const result of results) {
			this.#organismes.push(...result);
		}
	}
}
