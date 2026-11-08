import type { EpreuveParEquipeContract } from '#contracts/epreuve_par_equipe_contract';
import type { RequestParams } from '#core/abstract_http_client';
import type { HttpClientContract } from '#core/http_client_contract';
import type { ParametresAccesAuDetail } from '#models/epreuve/par_equipes/rencontre/rencontre';

import { ApiEndpoints } from '#enums/api_endpoints';
import { EquipePoule } from '#models/epreuve/par_equipes/poule/equipe_poule';
import { Poule } from '#models/epreuve/par_equipes/poule/poule';
import { DetailRencontre } from '#models/epreuve/par_equipes/rencontre/detail_rencontre';
import { Rencontre } from '#models/epreuve/par_equipes/rencontre/rencontre';

export class EpreuveParEquipeService implements EpreuveParEquipeContract {
	readonly #httpClient: HttpClientContract;

	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}

	async classementPoule(divisionId: number, pouleId?: number) {
		const params: RequestParams = {
			action: 'classement',
			auto: 1,
			D1: divisionId,
		};

		if (pouleId) {
			params['cx_poule'] = pouleId;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { classement: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_RESULT_EQU, params);

		if (!response.liste) {
			return [];
		}

		return response.liste.classement.map((model) => new EquipePoule(model));
	}

	async detailRencontre(
		rencontreId: number,
		extraParams?: ParametresAccesAuDetail,
	) {
		const response = await this.#httpClient.fetch<{
			liste:
				| ''
				| {
						resultat: Record<string, unknown>;
						joueur: Array<Record<string, unknown>>;
						partie: Array<Record<string, unknown>>;
				  };
		}>(ApiEndpoints.XML_CHP_RENC, {
			...extraParams,
			renc_id: rencontreId,
		});

		if (!response.liste) {
			return;
		}

		return new DetailRencontre(response.liste);
	}

	async ordrePoule(divisionId: number, pouleId?: number) {
		const params: RequestParams = {
			action: 'initial',
			auto: 1,
			D1: divisionId,
		};

		if (pouleId) {
			params['cx_poule'] = pouleId;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { classement: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_RESULT_EQU, params);

		if (!response.liste) {
			return [];
		}

		return response.liste.classement
			.map((model, index) => new EquipePoule({ ...model, pos: index + 1 }))
			.toSorted((a, b) => a.positionDepart! - b.positionDepart!);
	}

	async poulesPourDivision(divisionId: number) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { poule: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_RESULT_EQU, {
			action: 'poule',
			auto: 1,
			D1: divisionId,
		});

		if (!response.liste) {
			return [];
		}

		return response.liste.poule.map((model) => new Poule(model));
	}

	async rencontresPourPoule(divisionId: number, pouleId?: number) {
		const params: RequestParams = {
			action: '',
			auto: 1,
			D1: divisionId,
		};

		if (pouleId) {
			params['cx_poule'] = pouleId;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { tour: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_RESULT_EQU, params);

		if (!response.liste) {
			return [];
		}

		return response.liste.tour.map((model) => new Rencontre(model));
	}
}
