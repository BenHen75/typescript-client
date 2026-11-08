import { BaseModel } from '#models/base_model';
import { parseFfttMatchScore, parseFfttSets } from '#utils/match_source';
import * as vt from '#utils/value_transformer';

export class PartieRencontre extends BaseModel {
	readonly #joueurA: string | undefined;

	readonly #joueurB: string | undefined;

	readonly #scoreA: number | null | undefined;

	readonly #scoreB: number | null | undefined;

	readonly #detailManches: Array<number>;

	readonly #detailManchesComplet: Array<[number, number]>;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#joueurA = vt.stringIfDefined(data['ja']);
		this.#joueurB = vt.stringIfDefined(data['jb']);
		this.#scoreA =
			data['scorea'] === '-' ? 0 : parseFfttMatchScore(data['scorea']);
		this.#scoreB =
			data['scoreb'] === '-' ? 0 : parseFfttMatchScore(data['scoreb']);

		const detail = this.sourceText('detail') ?? '';
		this.#detailManchesComplet = parseFfttSets(detail);
		this.#detailManches =
			!detail || detail === '-' ? [] : detail.split(/\s+/).map(Number);
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
