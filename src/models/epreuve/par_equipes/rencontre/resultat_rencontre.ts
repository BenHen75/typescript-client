import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';

export class ResultatRencontre extends BaseModel {
	readonly #equipeA: string | undefined;

	readonly #equipeB: string | undefined;

	readonly #scoreA: number | undefined;

	readonly #scoreB: number | undefined;

	constructor(data: Record<string, unknown>) {
		super();

		this.#equipeA = vt.stringIfDefined(data['equa']);
		this.#equipeB = vt.stringIfDefined(data['equb']);
		this.#scoreA = vt.numberIfDefined(data['resa']);
		this.#scoreB = vt.numberIfDefined(data['resb']);
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
