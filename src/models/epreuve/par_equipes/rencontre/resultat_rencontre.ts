import { BaseModel } from '#models/base_model';
import { parseFfttMatchScore } from '#utils/match_source';
import * as vt from '#utils/value_transformer';

export class ResultatRencontre extends BaseModel {
	readonly #equipeA: string | undefined;

	readonly #equipeB: string | undefined;

	readonly #scoreA: number | null | undefined;

	readonly #scoreB: number | null | undefined;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#equipeA = vt.stringIfDefined(data['equa']);
		this.#equipeB = vt.stringIfDefined(data['equb']);
		this.#scoreA = parseFfttMatchScore(data['resa']);
		this.#scoreB = parseFfttMatchScore(data['resb']);
	}

	get equipeA() {
		return this.#equipeA;
	}

	get equipeB() {
		return this.#equipeB;
	}

	get scoreA() {
		return this.#scoreA;
	}

	get scoreB() {
		return this.#scoreB;
	}
}
