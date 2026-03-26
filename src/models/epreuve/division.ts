import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';

export class Division extends BaseModel {
	readonly #id: number;

	readonly #libelle: string;

	constructor(data: Record<string, unknown>) {
		super();

		this.#id = vt.number(data['iddivision']);
		this.#libelle = vt.string(data['libelle']);
	}

	get id() {
		return this.#id;
	}

	get libelle() {
		return this.#libelle;
	}
}
