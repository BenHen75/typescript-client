import { BaseModel } from '#models/base_model';
import { parseClassementJoueur, separerNomPrenom } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';

export class Classement extends BaseModel {
	readonly #rang: number;

	readonly #nom: string;

	readonly #prenom: string;

	readonly #numerote: boolean;

	readonly #numero: number;

	readonly #points: number;

	readonly #club: string;

	readonly #pointsCriterium: string;

	constructor(data: Record<string, unknown>) {
		super();

		this.#rang = vt.number(data['rang']);
		[this.#nom, this.#prenom] = separerNomPrenom(vt.string(data['nom']));
		this.#club = vt.string(data['club']);
		this.#pointsCriterium = vt.string(data['points']);

		const parsed = parseClassementJoueur(vt.string(data['clt']));
		this.#numero = parsed.numero!;
		this.#points = parsed.points!;
		this.#numerote = this.#numero !== null;
	}

	get rang() {
		return this.#rang;
	}

	get nom() {
		return this.#nom;
	}

	get prenom() {
		return this.#prenom;
	}

	get numerote() {
		return this.#numerote;
	}

	get numero() {
		return this.#numero;
	}

	get points() {
		return this.#points;
	}

	get club() {
		return this.#club;
	}

	get pointsCriterium() {
		return this.#pointsCriterium;
	}
}
