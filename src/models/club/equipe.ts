import { BaseModel } from '#models/base_model';
import { Division } from '#models/epreuve/division';
import * as vt from '#utils/value_transformer';

export class Equipe extends BaseModel {
	readonly #idEpreuve: number;

	readonly #libelleEpreuve: string;

	readonly #id: number;

	readonly #libelle: string;

	readonly #libelleDivision: string;

	readonly #lienDivision: string;

	readonly #idPoule: number;

	readonly #idDivision: number;

	readonly #idOrganisme: number;

	readonly #division: Division;

	constructor(data: Record<string, unknown>) {
		super();

		this.#idEpreuve = vt.number(data['idepr']);
		this.#libelleEpreuve = vt.string(data['libepr']);
		this.#id = vt.number(data['idequipe']);
		this.#libelle = vt.string(data['libequipe']);
		this.#libelleDivision = vt.string(data['libdivision']);
		this.#lienDivision = vt.string(data['liendivision']);

		const linkParts = new URLSearchParams(this.#lienDivision);

		this.#idPoule = vt.number(linkParts.get('cx_poule'));
		this.#idDivision = vt.number(linkParts.get('D1'));
		this.#idOrganisme = vt.number(linkParts.get('organisme_pere'));

		this.#division = new Division({
			iddivision: this.#idDivision,
			libelle: this.#libelleDivision,
		});
	}

	get idEpreuve() {
		return this.#idEpreuve;
	}

	get libelleEpreuve() {
		return this.#libelleEpreuve;
	}

	get id() {
		return this.#id;
	}

	get libelle() {
		return this.#libelle;
	}

	get libelleDivision() {
		return this.#libelleDivision;
	}

	get lienDivision() {
		return this.#lienDivision;
	}

	get idPoule() {
		return this.#idPoule;
	}

	get idDivision() {
		return this.#idDivision;
	}

	get idOrganisme() {
		return this.#idOrganisme;
	}

	get division() {
		return this.#division;
	}
}
