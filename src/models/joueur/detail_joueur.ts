import type { DateTime } from 'luxon';

import {
	CategorieLicenceAdministrative,
	CategorieLicenceAdministrativeDict,
} from '#enums/categorie_licence_administrative';
import {
	CertificationMedicale,
	CertificationMedicaleDict,
} from '#enums/certification_medicale';
import { Diplome, DiplomeDict } from '#enums/diplome';
import { Nationalite, NationaliteDict } from '#enums/nationalite';
import { Sexe, SexeDict } from '#enums/sexe';
import { TypeLicence, TypeLicenceDict } from '#enums/type_licence';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

export class DetailJoueur extends BaseModel {
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

	readonly #categorieAdministrative: CategorieLicenceAdministrative;

	readonly #pointsMensuels: number | undefined;

	readonly #pointsMensuelsPrecedents: number | undefined;

	readonly #valeurInitiale: number | undefined;

	readonly #dateMutation: DateTime | undefined;

	readonly #nationalite: Nationalite;

	readonly #plusHautGradeArbitre: Diplome | undefined;

	readonly #plusHautGradeJugeArbitre: Diplome | undefined;

	readonly #plusHautGradeTechnique: Diplome | undefined;

	constructor(data: Record<string, unknown>) {
		super();

		this.#id = vt.number(['idlicence']);
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
		this.#categorieAdministrative = vt.picklist(
			data['cat'],
			CategorieLicenceAdministrative,
		);
		this.#pointsMensuels = vt.numberIfDefined(data['pointm']);
		this.#pointsMensuelsPrecedents = vt.numberIfDefined(data['apointm']);
		this.#valeurInitiale = vt.numberIfDefined(data['initm']);
		this.#dateMutation = vt.dateIfDefined(
			data['mutation'],
			DATE_FORMAT.DEFAULT,
		);
		this.#nationalite = vt.picklist(data['natio'], Nationalite);
		this.#plusHautGradeArbitre = vt.picklistIfDefined(data['arb'], Diplome);
		this.#plusHautGradeJugeArbitre = vt.picklistIfDefined(data['ja'], Diplome);
		this.#plusHautGradeTechnique = vt.picklistIfDefined(data['tech'], Diplome);
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

	get categorieAdministrative() {
		return {
			code: this.#categorieAdministrative,
			label: enumLabel(
				CategorieLicenceAdministrative,
				CategorieLicenceAdministrativeDict,
				this.#categorieAdministrative,
			),
		};
	}

	get pointsMensuels() {
		return this.#pointsMensuels;
	}

	get pointsMensuelsPrecedents() {
		return this.#pointsMensuelsPrecedents;
	}

	get valeurInitiale() {
		return this.#valeurInitiale;
	}

	get dateMutation() {
		return this.#dateMutation;
	}

	get nationalite() {
		return {
			code: this.#nationalite,
			label: enumLabel(Nationalite, NationaliteDict, this.#nationalite),
		};
	}

	get plusHautGradeArbitre() {
		return this.#plusHautGradeArbitre
			? {
					code: this.#plusHautGradeArbitre,
					label: enumLabel(Diplome, DiplomeDict, this.#plusHautGradeArbitre),
				}
			: undefined;
	}

	get plusHautGradeJugeArbitre() {
		return this.#plusHautGradeJugeArbitre
			? {
					code: this.#plusHautGradeJugeArbitre,
					label: enumLabel(
						Diplome,
						DiplomeDict,
						this.#plusHautGradeJugeArbitre,
					),
				}
			: undefined;
	}

	get plusHautGradeTechnique() {
		return this.#plusHautGradeTechnique
			? {
					code: this.#plusHautGradeTechnique,
					label: enumLabel(Diplome, DiplomeDict, this.#plusHautGradeTechnique),
				}
			: undefined;
	}
}
