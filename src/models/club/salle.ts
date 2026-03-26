import { BaseModel } from '#models/base_model';

interface SalleProps {
	nom: string;
	ligneAdresse1: string;
	codePostal: string;
	ville: string;
	ligneAdresse2: string | undefined;
	ligneAdresse3: string | undefined;
	latitude: number | undefined;
	longitude: number | undefined;
}

export class Salle extends BaseModel {
	readonly #nom: string;

	readonly #ligneAdresse1: string;

	readonly #codePostal: string;

	readonly #ville: string;

	readonly #ligneAdresse2: string | undefined;

	readonly #ligneAdresse3: string | undefined;

	readonly #latitude: number | undefined;

	readonly #longitude: number | undefined;

	constructor(data: SalleProps) {
		super();

		this.#nom = data.nom;
		this.#ligneAdresse1 = data.ligneAdresse1;
		this.#codePostal = data.codePostal;
		this.#ville = data.ville;
		this.#ligneAdresse2 = data.ligneAdresse2;
		this.#ligneAdresse3 = data.ligneAdresse3;
		this.#latitude = data.latitude;
		this.#longitude = data.longitude;
	}

	get nom() {
		return this.#nom;
	}

	get ligneAdresse1() {
		return this.#ligneAdresse1;
	}

	get codePostal() {
		return this.#codePostal;
	}

	get ville() {
		return this.#ville;
	}

	get ligneAdresse2() {
		return this.#ligneAdresse2;
	}

	get ligneAdresse3() {
		return this.#ligneAdresse3;
	}

	get latitude() {
		return this.#latitude;
	}

	get longitude() {
		return this.#longitude;
	}

	get adresse() {
		let adresse = `${this.#nom} ${this.#ligneAdresse1}`;

		if (this.#ligneAdresse2) {
			adresse += ` - ${this.#ligneAdresse2}`;
		}

		if (this.#ligneAdresse3) {
			adresse += ` - ${this.#ligneAdresse3}`;
		}

		adresse += ` - ${this.#codePostal} ${this.#ville}`;

		return adresse;
	}
}
