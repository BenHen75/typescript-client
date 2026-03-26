import { BaseModel } from '#models/base_model';
import { separerNomPrenom } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';

export class Partie extends BaseModel {
	readonly #libelle: string;

	readonly #nomGagnant: string;

	readonly #prenomGagnant: string;

	readonly #nomPerdant: string;

	readonly #prenomPerdant: string;

	readonly #gagneParForfait: boolean;

	constructor(data: Record<string, unknown>) {
		super();

		this.#libelle = vt.string(data['libelle']);
		[this.#nomGagnant, this.#prenomGagnant] = separerNomPrenom(
			vt.string(data['vain']),
		);
		[this.#nomPerdant, this.#prenomPerdant] = separerNomPrenom(
			vt.string(data['perd']),
		);
		this.#gagneParForfait = vt.exists(data['forfait']);
	}

	get libelle() {
		return this.#libelle;
	}

	get nomGagnant() {
		return this.#nomGagnant;
	}

	get prenomGagnant() {
		return this.#prenomGagnant;
	}

	get nomPerdant() {
		return this.#nomPerdant;
	}

	get prenomPerdant() {
		return this.#prenomPerdant;
	}

	get gagneParForfait() {
		return this.#gagneParForfait;
	}
}
