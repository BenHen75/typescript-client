import { BaseModel } from '#models/base_model';

export class Initialisation extends BaseModel {
	readonly #appli: boolean;

	constructor(data: Record<string, unknown>) {
		super();

		this.#appli = data['appli'] === '1';
	}

	get appli() {
		return this.#appli;
	}
}
