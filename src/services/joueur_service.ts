import type { JoueurContract } from '#contracts/joueur_contract';
import type { RequestParams } from '#core/abstract_http_client';
import type { HttpClientContract } from '#core/http_client_contract';

import { ApiEndpoints } from '#enums/api_endpoints';
import { TypeLicence } from '#enums/type_licence';
import { FfttError } from '#errors/fftt_error';
import { DetailJoueur } from '#models/joueur/detail_joueur';
import { DetailJoueurBaseClassement } from '#models/joueur/detail_joueur_base_classement';
import { DetailJoueurBaseSPID } from '#models/joueur/detail_joueur_base_spid';
import { HistoriqueClassement } from '#models/joueur/historique_classement';
import { JoueurBaseClassement } from '#models/joueur/joueur_base_classement';
import { JoueurBaseSPID } from '#models/joueur/joueur_base_spid';
import { PartieBaseClassement } from '#models/partie/partie_base_classement';
import { PartieBaseSPID } from '#models/partie/partie_base_spid';
import { sourceCollection, sourceRecord } from '#utils/source_collection';

export class JoueurService implements JoueurContract {
	readonly #httpClient: HttpClientContract;

	constructor(httpClient: HttpClientContract) {
		this.#httpClient = httpClient;
	}

	async historiqueClassementOfficiel(licence: string) {
		const params: RequestParams = {
			numlic: licence,
		};

		const response = await this.#httpClient.fetch<{
			liste: '' | { histo: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_HISTO_CLASSEMENT, params);

		return sourceCollection(response, 'histo').map(
			(model) => new HistoriqueClassement(model),
		);
	}

	async historiquePartiesBaseSPID(licence: string) {
		const params: RequestParams = {
			numlic: licence,
		};

		const response = await this.#httpClient.fetch<{
			liste: '' | { partie: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_PARTIE, params);

		return sourceCollection(response, 'partie').map(
			(model) => new PartieBaseSPID(model),
		);
	}

	async joueurParLicence(licence: string) {
		const params: RequestParams = {
			licence,
		};

		const response = await this.#httpClient.fetch<{
			liste: '' | { licence: Record<string, unknown> };
		}>(ApiEndpoints.XML_LICENCE_B, params);

		const model = sourceRecord(response, 'licence');
		return model ? new DetailJoueur(model) : undefined;
	}

	async joueurParLicenceSurBaseClassement(licence: string) {
		const params: RequestParams = {
			numlic: licence,
		};

		const response = await this.#httpClient.fetch<{
			liste: '' | { joueur: Record<string, unknown> };
		}>(ApiEndpoints.XML_JOUEUR, params);

		const model = sourceRecord(response, 'joueur');
		return model ? new DetailJoueurBaseClassement(model) : undefined;
	}

	async joueurParLicenceSurBaseSPID(licence: string) {
		const params: RequestParams = {
			numlic: licence,
		};

		const response = await this.#httpClient.fetch<{
			liste: '' | { licence: Record<string, unknown> };
		}>(ApiEndpoints.XML_LICENCE, params);

		const model = sourceRecord(response, 'licence');
		return model ? new DetailJoueurBaseSPID(model) : undefined;
	}

	async joueursParClub(numeroClub: string) {
		const params: RequestParams = {
			club: numeroClub,
		};

		const response = await this.#httpClient.fetch<{
			liste: '' | { licence: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_LICENCE_B, params);

		return sourceCollection(response, 'licence').map(
			(model) => new DetailJoueur(model),
		);
	}

	async joueursParClubEtType(
		numeroClub: string,
		typesLicence: Array<TypeLicence>,
	) {
		const joueurs = await this.joueursParClub(numeroClub);

		return joueurs.filter(
			(joueur) =>
				joueur.typeLicence && typesLicence.includes(joueur.typeLicence.code),
		);
	}

	async joueursParClubSurBaseClassement(numeroClub: string) {
		const params: RequestParams = {
			club: numeroClub,
		};

		const response = await this.#httpClient.fetch<{
			liste: '' | { joueur: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_LISTE_JOUEUR, params);

		return sourceCollection(response, 'joueur').map(
			(model) => new JoueurBaseClassement(model),
		);
	}

	async joueursParClubSurBaseSPID(numeroClub: string, valide?: boolean) {
		const params: RequestParams = {
			club: numeroClub,
		};

		if (valide) {
			params['valid'] = 1;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { joueur: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_LISTE_JOUEUR_O, params);

		return sourceCollection(response, 'joueur').map(
			(model) => new JoueurBaseSPID(model),
		);
	}

	joueursParNom(nom: string, prenom?: string, valide?: boolean) {
		return this.joueursParNomSurBaseSPID(nom, prenom, valide);
	}

	async joueursParNomSurBaseClassement(nom: string, prenom?: string) {
		const params: RequestParams = {
			nom: nom,
		};

		if (prenom) {
			params['prenom'] = prenom;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { joueur: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_LISTE_JOUEUR, params);

		return sourceCollection(response, 'joueur').map(
			(model) => new JoueurBaseClassement(model),
		);
	}

	async joueursParNomSurBaseSPID(
		nom: string,
		prenom?: string,
		valide?: boolean,
	) {
		const params: RequestParams = {
			nom: nom,
		};

		if (prenom) {
			params['prenom'] = prenom;
		}

		if (valide) {
			params['valid'] = 1;
		}

		const response = await this.#httpClient.fetch<{
			liste: '' | { joueur: Array<Record<string, unknown>> };
		}>(ApiEndpoints.XML_LISTE_JOUEUR_O, params);

		return sourceCollection(response, 'joueur').map(
			(model) => new JoueurBaseSPID(model),
		);
	}
	/** Retired upstream endpoint. Callers must explicitly opt in and handle unsupported access. */
	async historiquePartiesBaseClassementLegacy(
		licence: string,
		options?: { enabled: boolean },
	) {
		if (!options?.enabled) throw new FfttError('FFTT_LEGACY_ENDPOINT_DISABLED');
		const response = await this.#httpClient.fetch<Record<string, unknown>>(
			ApiEndpoints.XML_PARTIE_MYSQL,
			{ licence },
		);
		return sourceCollection(response, 'partie').map(
			(model) => new PartieBaseClassement(model),
		);
	}
}
