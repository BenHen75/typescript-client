import type { EpreuveIndividuelleContract } from '#contracts/epreuve_individuelle_contract';
import type { RequestParams } from '#core/abstract_http_client';
import type { HttpClientContract } from '#core/http_client_contract';

import { ApiEndpoints } from '#enums/api_endpoints';
import { FfttError } from '#errors/fftt_error';
import { Classement } from '#models/epreuve/individuelle/classement';
import { Groupe } from '#models/epreuve/individuelle/groupe';
import { Partie } from '#models/epreuve/individuelle/partie';
import { sourceCollection } from '#utils/source_collection';

export class EpreuveIndividuelleService implements EpreuveIndividuelleContract {
	readonly #httpClient: HttpClientContract;

	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}

	async rechercherGroupes(epreuveId: number, divisionId: number) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { tour: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_RESULT_INDIV, {
			action: 'poule',
			epr: epreuveId,
			res_division: divisionId,
		});

		return sourceCollection(response, 'tour').map((model) => {
			const group = new Groupe(model);
			if (group.idEpreuve !== epreuveId || group.idDivision !== divisionId) {
				throw new FfttError('FFTT_INDIVIDUAL_CONTEXT_MISMATCH');
			}
			return group;
		});
	}

	async recupererClassement(
		epreuveId: number,
		divisionId: number,
		groupeId?: number,
	) {
		const params: RequestParams = {
			action: 'classement',
			epr: epreuveId,
			res_division: divisionId,
		};

		if (groupeId) {
			params['cx_tableau'] = groupeId;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { classement: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_RESULT_INDIV, params);

		return sourceCollection(response, 'classement').map(
			(model) => new Classement(model),
		);
	}

	async recupererClassementCriterium(divisionId: number) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { classement: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_RES_CLA, {
			res_division: divisionId,
		});

		return sourceCollection(response, 'classement').map(
			(model) => new Classement(model),
		);
	}

	async recupererParties(
		epreuveId: number,
		divisionId: number,
		groupeId?: number,
	) {
		const params: RequestParams = {
			action: 'partie',
			epr: epreuveId,
			res_division: divisionId,
		};

		if (groupeId) {
			params['cx_tableau'] = groupeId;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { partie: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_RESULT_INDIV, params);

		return sourceCollection(response, 'partie').map(
			(model) => new Partie(model),
		);
	}
}
