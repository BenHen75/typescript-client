import type { HttpClientContract } from '#core/http_client_contract';

import { HttpClient } from '#core/http_client';
import { ActualitesService } from '#services/actualites_service';
import { AuthentificationService } from '#services/authentification_service';
import { ClubService } from '#services/club_service';
import { EpreuveIndividuelleService } from '#services/epreuve_individuelle_service';
import { EpreuveParEquipeService } from '#services/epreuve_par_equipe_service';
import { EpreuveService } from '#services/epreuve_service';
import { JoueurService } from '#services/joueur_service';
import { OrganismeService } from '#services/organisme_service';

type HttpClientConstructor = new (
	appId: string,
	appKey: string,
	serial: string,
) => HttpClientContract;

export class FFTTApi {
	actualites: ActualitesService;

	authentification: AuthentificationService;

	club: ClubService;

	epreuveIndividuelle: EpreuveIndividuelleService;

	epreuveParEquipe: EpreuveParEquipeService;

	epreuve: EpreuveService;

	joueur: JoueurService;

	organisme: OrganismeService;

	private constructor(httpClient: HttpClientContract) {
		this.actualites = new ActualitesService(httpClient);
		this.authentification = new AuthentificationService(httpClient);
		this.club = new ClubService(httpClient);
		this.epreuveIndividuelle = new EpreuveIndividuelleService(httpClient);
		this.epreuveParEquipe = new EpreuveParEquipeService(httpClient);
		this.epreuve = new EpreuveService(httpClient);
		this.joueur = new JoueurService(httpClient);
		this.organisme = new OrganismeService(httpClient);
	}

	/**
	 * Initialise la librairie avec les identifiants fournis par la FFTT.
	 *
	 * @param appId Identifiant unique fourni par la FFTT.
	 * @param appKey Mot de passe unique fourni par la FFTT.
	 * @param serial Chaîne de caractères identifiant l'utilisateur de façon permanente, doit respecter le format suivant : [A-Za-z0-9]{15}.
	 * @param httpClient
	 */
	static create(
		appId: string,
		appKey: string,
		serial: string,
		httpClient?: HttpClientConstructor,
	) {
		const client = httpClient
			? new httpClient(appId, appKey, serial)
			: new HttpClient(appId, appKey, serial);

		return new this(client);
	}
}
