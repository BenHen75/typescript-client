import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';

export class HistoriqueClassement extends BaseModel {
	readonly #numerote: boolean;

	readonly #numero: number | undefined;

	readonly #pointsOfficiels: number;

	readonly #saison: string;

	readonly #phase: number;

	constructor(data: Record<string, unknown>) {
		super();

		this.#numerote = vt.exists(data['echelon']);
		this.#numero = vt.numberIfDefined(data['place']);
		this.#pointsOfficiels = vt.number(data['point']);
		this.#saison = vt.string(data['saison']);
		this.#phase = vt.number(data['phase']);
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

	get saison() {
		return this.#saison;
	}

	get phase() {
		return this.#phase;
	}
}
