import type { DateTime } from 'luxon';

import { BaseModel } from '#models/base_model';
import { parseClassementJoueur, separerNomPrenom } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

export class PartieBaseSPID extends BaseModel {
	readonly #date: DateTime;

	readonly #nom: string;

	readonly #prenom: string;

	readonly #numerote: boolean;

	readonly #numero: number | undefined;

	readonly #points: number;

	readonly #epreuve: string;

	readonly #victoire: boolean;

	readonly #forfait: boolean;

	readonly #id: number;

	readonly #coefficient: number;

	constructor(data: Record<string, unknown>) {
		super();

		this.#date = vt.date(data['date'], DATE_FORMAT.DEFAULT);
		[this.#nom, this.#prenom] = separerNomPrenom(vt.string(data['nom']));
		this.#numerote = vt.string(data['classement']).startsWith('N');
		this.#epreuve = vt.string(data['epreuve']);
		this.#victoire = vt.string(data['victoire']) === 'V';
		this.#forfait = vt.string(data['forfait']) === '1';
		this.#id = vt.number(data['idpartie']);
		this.#coefficient = vt.number(data['coefchamp']);

		const classement = parseClassementJoueur(vt.string(data['classement']));
		this.#numero = classement.numero;
		this.#points = classement.points!;
	}

	get date() {
		return this.#date;
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
}
