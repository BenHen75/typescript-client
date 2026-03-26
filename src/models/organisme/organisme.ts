import { TypeOrganisme, TypeOrganismeDict } from '#enums/type_organisme';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import * as vt from '#utils/value_transformer';

export class Organisme extends BaseModel {
	readonly #id: number;
	readonly #libelle: string;
	readonly #code: string;
	readonly #idOrganismeParent: number | undefined;
	readonly #type: TypeOrganisme;

	constructor(data: Record<string, unknown>) {
		super();

		this.#id = vt.number(data['id']);
		this.#libelle = vt.string(data['libelle']);
		this.#code = vt.string(data['code']);
		this.#idOrganismeParent = vt.numberIfDefined(data['idPere']);
		this.#type = vt.picklist(
			vt.string(data['code']).slice(0, 1),
			TypeOrganisme,
		);
	}

	get id() {
		return this.#id;
	}

	get libelle() {
		return this.#libelle;
	}

	get code() {
		return this.#code;
	}

	get idOrganismeParent() {
		return this.#idOrganismeParent;
	}

	get type() {
		return {
			code: this.#type,
			label: enumLabel(TypeOrganisme, TypeOrganismeDict, this.#type),
		};
	}
}
