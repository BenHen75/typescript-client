import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';

export class JoueurBaseClassement extends BaseModel {
	readonly #licence: string;

	readonly #nom: string;

	readonly #prenom: string;

	readonly #club: string;

	readonly #numeroClub: string;

	readonly #classement: number | undefined;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#licence = vt.string(data['licence']);
		this.#nom = vt.string(data['nom']);
		this.#prenom = vt.string(data['prenom']);
		this.#club = vt.string(data['club']);
		this.#numeroClub = vt.string(data['nclub']);

		const clt = vt.string(data['clast']);
		if (clt.startsWith('N')) {
			this.#classement = vt.number(data['clast']);
		}
	}

	get licence() {
		return this.#licence;
	}

	get nom() {
		return this.#nom;
	}

	get prenom() {
		return this.#prenom;
	}

	get club() {
		return this.#club;
	}

	get numeroClub() {
		return this.#numeroClub;
	}

	get classement() {
		return this.#classement;
	}
}
