import type { DateTime } from 'luxon';

import type { PartieBaseSPID } from '#models/partie/partie_base_spid';

import { Sexe, SexeDict } from '#enums/sexe';
import { BaseModel } from '#models/base_model';
import { PartieBaseClassement } from '#models/partie/partie_base_classement';
import { enumLabel } from '#utils/enum_utils';

export class Partie extends BaseModel {
	readonly #date: DateTime;

	readonly #nomAdversaire: string;

	readonly #prenomAdversaire: string;

	readonly #adversaireNumerote: boolean;

	readonly #numeroAdversaire: number | undefined;

	readonly #pointsAdversaire: number;

	readonly #epreuve: string;

	readonly #victoire: boolean;

	readonly #forfait: boolean;

	readonly #id: number;

	readonly #coefficient: number;

	readonly #licence: string | undefined;

	readonly #licenceAdversaire: string | undefined;

	readonly #numeroJournee: number | undefined;

	readonly #codeChampionnat: string | undefined;

	readonly #sexeAdversaire: Sexe | undefined;

	readonly #pointsObtenus: number | undefined;

	readonly #valide: boolean;

	constructor(baseSPID: PartieBaseSPID, baseClassement?: PartieBaseClassement) {
		super();

		this.#date = baseSPID.date;
		this.#nomAdversaire = baseSPID.nom;
		this.#prenomAdversaire = baseSPID.prenom;
		this.#adversaireNumerote = baseSPID.numerote;
		this.#numeroAdversaire = baseSPID.numero;
		this.#pointsAdversaire = baseSPID.points;
		this.#epreuve = baseSPID.epreuve;
		this.#victoire = baseSPID.victoire;
		this.#forfait = baseSPID.forfait;
		this.#id = baseSPID.id;
		this.#coefficient = baseSPID.coefficient;
		this.#licence = baseClassement?.licence;
		this.#licenceAdversaire = baseClassement?.licenceAdversaire;
		this.#numeroJournee = baseClassement?.numeroJournee;
		this.#codeChampionnat = baseClassement?.codeChampionnat;
		this.#sexeAdversaire = baseClassement?.sexeAdversaire.code;
		this.#pointsObtenus = baseClassement?.pointsObtenus;
		this.#valide = baseClassement instanceof PartieBaseClassement;
	}

	get date() {
		return this.#date;
	}

	get nomAdversaire() {
		return this.#nomAdversaire;
	}

	get prenomAdversaire() {
		return this.#prenomAdversaire;
	}

	get adversaireNumerote() {
		return this.#adversaireNumerote;
	}

	get numeroAdversaire() {
		return this.#numeroAdversaire;
	}

	get pointsAdversaire() {
		return this.#pointsAdversaire;
	}

	get epreuve() {
		return this.#epreuve;
	}

	get victoire() {
		return this.#victoire;
	}

	get forfait() {
		return this.#forfait;
	}

	get id() {
		return this.#id;
	}

	get coefficient() {
		return this.#coefficient;
	}

	get licence() {
		return this.#licence;
	}

	get licenceAdversaire() {
		return this.#licenceAdversaire;
	}

	get numeroJournee() {
		return this.#numeroJournee;
	}

	get codeChampionnat() {
		return this.#codeChampionnat;
	}

	get sexeAdversaire() {
		return this.#sexeAdversaire
			? {
					code: this.#sexeAdversaire,
					label: enumLabel(Sexe, SexeDict, this.#sexeAdversaire),
				}
			: undefined;
	}

	get pointsObtenus() {
		return this.#pointsObtenus;
	}

	get valide() {
		return this.#valide;
	}
}
