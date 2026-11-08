import {
	CategorieLicenceAdministrative,
	CategorieLicenceAdministrativeDict,
} from '#enums/categorie_licence_administrative';
import { Nationalite, NationaliteDict } from '#enums/nationalite';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import * as vt from '#utils/value_transformer';

export class DetailJoueurBaseClassement extends BaseModel {
	readonly #licence: string;

	readonly #nom: string;

	readonly #prenom: string;

	readonly #club: string;

	readonly #numeroClub: string;

	readonly #nationalite: Nationalite;

	readonly #classementGlobal: number;

	readonly #classementGlobalPrecedent: number | undefined;

	readonly #pointsMensuels: number;

	readonly #pointsMensuelsPrecedents: number;

	readonly #numerote: boolean;

	readonly #numero: number | undefined;

	readonly #classementOfficiel: number | undefined;

	readonly #classementNational: number;

	readonly #categorieAdministrative: CategorieLicenceAdministrative | undefined;

	readonly #rangRegional: number;

	readonly #rangDepartemental: number;

	readonly #pointsOfficiels: number;

	readonly #propositionClassement: number | string;

	readonly #valeurDebutSaison: number;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#licence = vt.string(data['licence']);
		this.#nom = vt.string(data['nom']);
		this.#prenom = vt.string(data['prenom']);
		this.#club = vt.string(data['club']);
		this.#numeroClub = vt.string(data['nclub']);
		this.#nationalite = vt.picklistIfDefined(data['natio'], Nationalite) ?? 'F';
		this.#classementGlobal = vt.number(data['clglob']);
		this.#classementGlobalPrecedent = vt.numberIfDefined(
			data['aclglob'],
			false,
		);
		this.#pointsMensuels = vt.number(data['point']);
		this.#pointsMensuelsPrecedents = vt.number(data['apoint']);
		this.#numerote = vt.string(data['clast']).startsWith('N');

		if (this.#numerote) {
			this.#numero = Number(vt.string(data['clast']).slice(1));
		} else {
			this.#classementOfficiel = vt.number(data['clast']);
		}

		this.#classementNational = vt.number(data['clnat']);
		this.#categorieAdministrative = vt.picklistIfDefined(
			data['categ'],
			CategorieLicenceAdministrative,
		);
		this.#rangRegional = vt.number(data['rangreg']);
		this.#rangDepartemental = vt.number(data['rangdep']);
		this.#pointsOfficiels = vt.number(data['valcla']);
		this.#propositionClassement = vt.string(data['clpro']);
		this.#valeurDebutSaison = vt.number(data['valinit']);
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

	get nationalite() {
		return {
			code: this.#nationalite,
			label: enumLabel(Nationalite, NationaliteDict, this.#nationalite),
		};
	}

	get classementGlobal() {
		return this.#classementGlobal;
	}

	get classementGlobalPrecedent() {
		return this.#classementGlobalPrecedent;
	}

	get pointsMensuels() {
		return this.#pointsMensuels;
	}

	get pointsMensuelsPrecedents() {
		return this.#pointsMensuelsPrecedents;
	}

	get numerote() {
		return this.#numerote;
	}

	get numero() {
		return this.#numero;
	}

	get classementOfficiel() {
		return this.#classementOfficiel;
	}

	get classementNational() {
		return this.#classementNational;
	}

	get categorieAdministrative() {
		return {
			code: this.#categorieAdministrative,
			label:
				this.#categorieAdministrative === undefined
					? undefined
					: enumLabel(
							CategorieLicenceAdministrative,
							CategorieLicenceAdministrativeDict,
							this.#categorieAdministrative,
						),
		};
	}

	get rangRegional() {
		return this.#rangRegional;
	}

	get rangDepartemental() {
		return this.#rangDepartemental;
	}

	get pointsOfficiels() {
		return this.#pointsOfficiels;
	}

	get propositionClassement() {
		return this.#propositionClassement;
	}

	get valeurDebutSaison() {
		return this.#valeurDebutSaison;
	}
}
