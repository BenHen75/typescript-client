import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';

export class EquipePoule extends BaseModel {
	readonly #poule: number;

	readonly #classement: number;

	readonly #equipe: string;

	readonly #rencontresJouees: number;

	readonly #pointsRencontre: number;

	readonly #numeroClub: string;

	readonly #pointsPartieGagnes: number;

	readonly #pointsPartiePerdus: number;

	readonly #idEquipe: number;

	readonly #idClub: number;

	readonly #victoires: number;

	readonly #defaites: number;

	readonly #nuls: number;

	readonly #totalPenalitesOuForfaits: number;

	readonly #positionDepart: number | undefined;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#poule = vt.number(data['poule']);
		this.#classement = vt.number(data['clt'] ?? data['classement']);
		this.#equipe = vt.string(data['equipe']);
		this.#rencontresJouees = vt.number(data['joue']);
		this.#pointsRencontre = vt.number(data['pts']);
		this.#numeroClub = vt.string(data['numero']);
		this.#pointsPartieGagnes = vt.number(data['pg']);
		this.#pointsPartiePerdus = vt.number(data['pp']);
		this.#idEquipe = vt.number(data['idequipe']);
		this.#idClub = vt.number(data['idclub']);
		this.#victoires = vt.number(data['vic']);
		this.#defaites = vt.number(data['def']);
		this.#nuls = vt.number(data['nul']);
		this.#totalPenalitesOuForfaits = vt.number(data['pf']);
		this.#positionDepart = vt.numberIfDefined(data['pos']);
	}

	get poule() {
		return this.#poule;
	}

	get classement() {
		return this.#classement;
	}

	get equipe() {
		return this.#equipe;
	}

	get rencontresJouees() {
		return this.#rencontresJouees;
	}

	get pointsRencontre() {
		return this.#pointsRencontre;
	}

	get numeroClub() {
		return this.#numeroClub;
	}

	get pointsPartieGagnes() {
		return this.#pointsPartieGagnes;
	}

	get pointsPartiePerdus() {
		return this.#pointsPartiePerdus;
	}

	get idEquipe() {
		return this.#idEquipe;
	}

	get idClub() {
		return this.#idClub;
	}

	get victoires() {
		return this.#victoires;
	}

	get defaites() {
		return this.#defaites;
	}

	get nuls() {
		return this.#nuls;
	}

	get totalPenalitesOuForfaits() {
		return this.#totalPenalitesOuForfaits;
	}

	get positionDepart() {
		return this.#positionDepart;
	}
}
