import { TypeEpreuve, TypeEpreuveDict } from '#enums/type_epreuve';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import * as vt from '#utils/value_transformer';

export class Epreuve extends BaseModel {
	readonly #id: number;

	readonly #idOrganisme: number;

	readonly #libelle: string;

	readonly #type: TypeEpreuve;

	constructor(data: Record<string, unknown>) {
		super();

		this.#id = vt.number(data['idepreuve']);
		this.#idOrganisme = vt.number(data['idorga']);
		this.#libelle = vt.string(data['libelle']);
		this.#type = vt.picklist(data['typepreuve'], TypeEpreuve);
	}

	get id() {
		return this.#id;
	}

	get idOrganisme() {
		return this.#idOrganisme;
	}

	get libelle() {
		return this.#libelle;
	}

	get type() {
		return {
			code: this.#type,
			label: enumLabel(TypeEpreuve, TypeEpreuveDict, this.#type),
		};
	}
}
