import { Sexe, SexeDict } from '#enums/sexe';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import { classementDepuisPoints } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';

export class JoueurBaseSPID extends BaseModel {
	readonly #licence: string;

	readonly #nom: string;

	readonly #prenom: string;

	readonly #club: string | undefined;

	readonly #numeroClub: string | undefined;

	readonly #sexe: Sexe;

	readonly #numerote: boolean;

	readonly #numero: number | undefined;

	readonly #pointsOfficiels: number;

	readonly #classementOfficiel: number;

	constructor(data: Record<string, unknown>) {
		super();

		this.#licence = vt.string(data['licence']);
		this.#nom = vt.string(data['nom']);
		this.#prenom = vt.string(data['prenom']);
		this.#club = vt.stringIfDefined(data['club']);
		this.#numeroClub = vt.stringIfDefined(data['nclub']);
		this.#sexe = vt.picklist(data['sexe'], Sexe);
		this.#numerote = vt.exists(data['echelon']);
		this.#numero = vt.numberIfDefined(data['place'], false);
		this.#pointsOfficiels = vt.number(data['points']);
		this.#classementOfficiel = classementDepuisPoints(
			vt.string(data['points']),
		);
	}

	get licence() {
		return this.#licence;
	}

	get nom() {
		return this.#nom;
	}

	get prenom() {
		return this.#prenom;
	}

	get club() {
		return this.#club;
	}

	get numeroClub() {
		return this.#numeroClub;
	}

	get sexe() {
		return {
			code: this.#sexe,
			label: enumLabel(Sexe, SexeDict, this.#sexe),
		};
	}

	get numerote() {
		return this.#numerote;
	}

	get numero() {
		return this.#numero;
	}

	get pointsOfficiels() {
		return this.#pointsOfficiels;
	}

	get classementOfficiel() {
		return this.#classementOfficiel;
	}
}
