import type { OrganismeContract } from '#contracts/organisme_contract';
import type { HttpClientContract } from '#core/http_client_contract';

import { ApiEndpoints } from '#enums/api_endpoints';
import { TypeOrganisme } from '#enums/type_organisme';
import { FfttError } from '#errors/fftt_error';
import { Organisme } from '#models/organisme/organisme';
import { sourceCollection } from '#utils/source_collection';

export class OrganismeService implements OrganismeContract {
	readonly #httpClient: HttpClientContract;
	#organismes: Array<Organisme> = [];
	#loading: Promise<void> | undefined;
	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}
	async organisme(code: string) {
		await this.#load();
		return this.#organismes.find((item) => item.code === code);
	}
	async organismesEnfants(code: string) {
		await this.#load();
		const parent = this.#organismes.find((item) => item.code === code);
		return parent
			? this.#organismes.filter((item) => item.idOrganismeParent === parent.id)
			: [];
	}
	async organismesParType(type: TypeOrganisme) {
		await this.#load();
		return this.#organismes.filter((item) => item.type.code === type);
	}
	#load(): Promise<void> {
		this.#loading ??= this.#fill().catch((error: unknown) => {
			this.#loading = undefined;
			throw error instanceof Error
				? error
				: new FfttError('FFTT_NETWORK_ERROR');
		});
		return this.#loading;
	}
	async #fill(): Promise<void> {
		const types = Object.values(TypeOrganisme);
		const byId = new Map<number, Organisme>();
		for (const type of types) {
			const response = await this.#httpClient.fetch(
				ApiEndpoints.XML_ORGANISME,
				{ type },
			);
			const models = sourceCollection(response, 'organisme').map(
				(row) => new Organisme(row),
			);
			for (const model of models) {
				if (!Number.isSafeInteger(model.id) || model.id <= 0)
					throw new FfttError('FFTT_INVALID_RESPONSE');
				const previous = byId.get(model.id);
				if (
					previous &&
					(previous.code !== model.code ||
						previous.libelle !== model.libelle ||
						previous.idOrganismeParent !== model.idOrganismeParent)
				)
					throw new FfttError('FFTT_INVALID_RESPONSE');
				byId.set(model.id, model);
			}
			// Some responses ignore type and already contain the complete tree.
			if (
				types.every((kind) => models.some((model) => model.type.code === kind))
			)
				break;
		}
		this.#organismes = [...byId.values()];
	}
}
