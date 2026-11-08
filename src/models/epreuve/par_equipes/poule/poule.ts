import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';

export class Poule extends BaseModel {
	readonly #libelle: string;

	readonly #id: number;

	readonly #idDivision: number;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#libelle = vt.string(data['libelle']);

		const parsed = new URLSearchParams(vt.string(data['lien']));

		this.#id = vt.number(parsed.get('cx_poule'));
		this.#idDivision = vt.number(parsed.get('D1'));
	}

	get libelle() {
		return this.#libelle;
	}

	get id() {
		return this.#id;
	}

	get idDivision() {
		return this.#idDivision;
	}
}
