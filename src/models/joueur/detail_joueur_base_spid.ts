import type { DateTime } from 'luxon';

import {
	CategorieLicenceNommee,
	CategorieLicenceNommeeDict,
} from '#enums/categorie_licence_nommee';
import {
	CertificationMedicale,
	CertificationMedicaleDict,
} from '#enums/certification_medicale';
import { Sexe, SexeDict } from '#enums/sexe';
import { TypeLicence, TypeLicenceDict } from '#enums/type_licence';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

export class DetailJoueurBaseSPID extends BaseModel {
	readonly #id: number;

	readonly #licence: string;

	readonly #nom: string;

	readonly #prenom: string;

	readonly #club: string;

	readonly #numeroClub: string;

	readonly #sexe: Sexe;

	readonly #typeLicence: TypeLicence | undefined;

	readonly #certificationMedicale: CertificationMedicale;

	readonly #dateValidation: DateTime | undefined;

	readonly #numerote: boolean;

	readonly #numero: number | undefined;

	readonly #pointsOfficiels: number;

	readonly #categorieLicence: CategorieLicenceNommee;

	constructor(data: Record<string, unknown>) {
		super();

		this.#id = vt.number(data['idlicence']);
		this.#licence = vt.string(data['licence']);
		this.#nom = vt.string(data['nom']);
		this.#prenom = vt.string(data['prenom']);
		this.#club = vt.string(data['nomclub']);
		this.#numeroClub = vt.string(data['numclub']);
		this.#sexe = vt.picklist(data['sexe'], Sexe);
		this.#typeLicence = vt.picklistIfDefined(data['type'], TypeLicence);
		this.#certificationMedicale = vt.picklist(
			data['certif'],
			CertificationMedicale,
		);
		this.#dateValidation = vt.dateIfDefined(
			data['validation'],
			DATE_FORMAT.DEFAULT,
		);
		this.#numerote = vt.exists(data['echelon']);
		this.#numero = vt.numberIfDefined(data['place'], false);
		this.#pointsOfficiels = vt.number(data['point']);
		this.#categorieLicence = vt.picklist(data['cat'], CategorieLicenceNommee);
	}

	get id() {
		return this.#id;
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

	get sexe() {
		return {
			code: this.#sexe,
			label: enumLabel(Sexe, SexeDict, this.#sexe),
		};
	}

	get typeLicence() {
		return this.#typeLicence
			? {
					code: this.#typeLicence,
					label: enumLabel(TypeLicence, TypeLicenceDict, this.#typeLicence),
				}
			: undefined;
	}

	get certificationMedicale() {
		return {
			code: this.#certificationMedicale,
			label: enumLabel(
				CertificationMedicale,
				CertificationMedicaleDict,
				this.#certificationMedicale,
			),
		};
	}

	get dateValidation() {
		return this.#dateValidation;
	}

	get numerote() {
		return this.#numerote;
	}

	get numero() {
		return this.#numero;
	}

	get pointsOfficiels() {
		return this.#pointsOfficiels;
	}

	get categorieLicence() {
		return {
			code: this.#categorieLicence,
			label: enumLabel(
				CategorieLicenceNommee,
				CategorieLicenceNommeeDict,
				this.#categorieLicence,
			),
		};
	}
}
