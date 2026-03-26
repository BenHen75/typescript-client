import type { DateTime } from 'luxon';

import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

export class Groupe extends BaseModel {
	readonly #libelle: string;

	readonly #idEpreuve: number;

	readonly #idDivision: number;

	readonly #id: number;

	readonly #date: DateTime;

	constructor(data: Record<string, unknown>) {
		super();

		this.#libelle = vt.string(data['libelle']);
		this.#date = vt.date(data['date'], DATE_FORMAT.DEFAULT);

		const parsed = new URLSearchParams(vt.string(data['lien']));

		this.#idEpreuve = vt.number(parsed.get('epr'));
		this.#idDivision = vt.number(parsed.get('res_division'));
		this.#id = vt.number(parsed.get('cx_tableau'));
	}

	get libelle() {
		return this.#libelle;
	}

	get idEpreuve() {
		return this.#idEpreuve;
	}

	get idDivision() {
		return this.#idDivision;
	}

	get id() {
		return this.#id;
	}

	get date() {
		return this.#date;
	}
}
