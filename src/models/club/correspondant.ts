import { BaseModel } from '#models/base_model';

interface CorrespondantProps {
	nom: string;
	prenom: string;
	email: string;
	telephone: string;
}

export class Correspondant extends BaseModel {
	readonly #nom: string;

	readonly #prenom: string;

	readonly #email: string;

	readonly #telephone: string;

	constructor(data: CorrespondantProps) {
		super();

		this.#nom = data.nom;
		this.#prenom = data.prenom;
		this.#email = data.email;
		this.#telephone = data.telephone;
	}

	get nom() {
		return this.#nom;
	}

	get prenom() {
		return this.#prenom;
	}

	get email() {
		return this.#email;
	}

	get telephone() {
		return {
			original: this.#telephone,
			formatted: this.#telephone.replaceAll(/(\d{2})(?=\d)/g, '$1 '),
		};
	}
}
