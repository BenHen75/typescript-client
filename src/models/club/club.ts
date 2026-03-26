import { DateTime } from 'luxon';

import { TypeClub, TypeClubDict } from '#enums/type_club';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

export class Club extends BaseModel {
	readonly #id: string;

	readonly #numero: string;

	readonly #nom: string;

	readonly #validation: DateTime | undefined;

	readonly #type: TypeClub;

	constructor(data: Record<string, unknown>) {
		super();

		this.#id = vt.string(data['idclub']);
		this.#numero = vt.string(data['numero']);
		this.#nom = vt.string(data['nom']);
		this.#validation = vt.dateIfDefined(
			data['validation'],
			DATE_FORMAT.DEFAULT,
		);
		this.#type = vt.picklist(data['typeclub'], TypeClub);
	}

	get id() {
		return this.#id;
	}

	get numero() {
		return this.#numero;
	}

	get nom() {
		return this.#nom;
	}

	get validation() {
		return this.#validation;
	}

	get type() {
		return {
			code: this.#type,
			label: enumLabel(TypeClub, TypeClubDict, this.#type),
		};
	}
}
