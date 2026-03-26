import type { ClubContract } from '#contracts/club_contract';
import type { RequestParams } from '#core/abstract_http_client';
import type { HttpClientContract } from '#core/http_client_contract';
import type { TypeEquipe } from '#enums/type_equipe';

import { ApiEndpoints } from '#enums/api_endpoints';
import { Club } from '#models/club/club';
import { DetailClub } from '#models/club/detail_club';
import { Equipe } from '#models/club/equipe';

export class ClubService implements ClubContract {
	readonly #httpClient: HttpClientContract;

	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}

	async clubsParCodePostal(codePostal: string) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { club: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_CLUB_B, { code: codePostal });

		if (response.liste === '') {
			return [];
		}

		return response.liste.club.map((model) => new Club(model));
	}

	async clubsParDepartement(departement: string) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { club: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_CLUB_DEP_2, { dep: departement });

		if (response.liste === '') {
			return [];
		}

		return response.liste.club.map((model) => new Club(model));
	}

	async clubsParNom(nom: string) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { club: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_CLUB_B, { ville: nom });

		if (response.liste === '') {
			return [];
		}

		return response.liste.club.map((model) => new Club(model));
	}

	async clubsParVille(ville: string) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { club: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_CLUB_B, { ville });

		if (response.liste === '') {
			return [];
		}

		return response.liste.club.map((model) => new Club(model));
	}

	async detailClub(code: string, idEquipe?: string) {
		const params: RequestParams = {
			club: code,
		};

		if (idEquipe) {
			params['idEquipe'] = idEquipe;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { club: Record<string, unknown> };
		}>(ApiEndpoints.XML_CLUB_DETAIL, params);

		if (response.liste === '') {
			return;
		}

		return new DetailClub(response.liste.club);
	}

	async equipesClub(code: string, typeEquipe: TypeEquipe) {
		const response = await this.#httpClient.fetch<{
			liste: '' | { equipe: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_EQUIPE, { numclu: code, type: typeEquipe });

		if (response.liste === '') {
			return [];
		}

		return response.liste.equipe.map((model) => new Equipe(model));
	}
}
