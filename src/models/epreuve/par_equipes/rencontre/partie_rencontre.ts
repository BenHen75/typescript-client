import { BaseModel } from '#models/base_model';
import { detaillerScores } from '#utils/score_utils';
import * as vt from '#utils/value_transformer';

export class PartieRencontre extends BaseModel {
	readonly #joueurA: string | undefined;

	readonly #joueurB: string | undefined;

	readonly #scoreA: number | undefined;

	readonly #scoreB: number | undefined;

	readonly #detailManches: Array<number>;

	readonly #detailManchesComplet: Array<[number, number]>;

	constructor(data: Record<string, unknown>) {
		super();

		this.#joueurA = vt.stringIfDefined(data['ja']);
		this.#joueurB = vt.stringIfDefined(data['jb']);
		this.#scoreA =
			vt.string(data['scorea']) === '-' ? 0 : Number(data['scorea']);
		this.#scoreB =
			vt.string(data['scoreb']) === '-' ? 0 : Number(data['scoreb']);

		const detail = vt.string(data['detail']);
		this.#detailManches = detail === '-' ? [] : detail.split(' ').map(Number);
		this.#detailManchesComplet = detaillerScores(this.#detailManches);
	}

	get joueurA() {
		return this.#joueurA;
	}

	get joueurB() {
		return this.#joueurB;
	}

	get scoreA() {
		return this.#scoreA;
	}

	get scoreB() {
		return this.#scoreB;
	}

	get detailManches() {
		return this.#detailManches;
	}

	get detailManchesComplet() {
		return this.#detailManchesComplet;
	}
}
