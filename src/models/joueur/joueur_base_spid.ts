import { Sexe, SexeDict } from '#enums/sexe';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import { classementDepuisPoints } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';

export class JoueurBaseSPID extends BaseModel {
	readonly #licence: string;

	readonly #nom: string;

	readonly #prenom: string;

	readonly #club: string | undefined;

	readonly #numeroClub: string | undefined;

	readonly #sexe: Sexe | undefined;

	readonly #numerote: boolean;

	readonly #numero: number | undefined;

	readonly #pointsOfficiels: number;

	readonly #classementOfficiel: number;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#licence = vt.string(data['licence']);
		this.#nom = vt.string(data['nom']);
		this.#prenom = vt.string(data['prenom']);
		const club = vt.stringIfDefined(data['club']);
		const nclub = vt.stringIfDefined(data['nclub']);
		// SPID feeds may invert the two historical fields. Only a club number is an identifier.
		this.#numeroClub = [club, nclub].find(
			(value) => value !== undefined && /^\d{8}$/.test(value),
		);
		this.#club = [club, nclub].find(
			(value) => value !== undefined && !/^\d{8}$/.test(value),
		);
		this.#sexe = vt.picklistIfDefined(data['sexe'], Sexe);
		this.#numerote = vt.exists(data['echelon']);
		this.#numero = vt.numberIfDefined(data['place'], false);
		this.#pointsOfficiels = vt.number(data['points']);
		this.#classementOfficiel = classementDepuisPoints(
			vt.string(data['points']),
		);
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
			label:
				this.#sexe === undefined
					? undefined
					: enumLabel(Sexe, SexeDict, this.#sexe),
		};
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

	get classementOfficiel() {
		return this.#classementOfficiel;
	}
	get donneesPubliques() {
		// Read both source values to reject malformed fields rather than silently invent a club.
		const clubs = [this.sourceText('club'), this.sourceText('nclub')];
		return {
			licence: this.licence,
			nom: this.sourceText('nom') ?? '',
			prenom: this.sourceText('prenom') ?? '',
			numeroClub: clubs.find(
				(value) => typeof value === 'string' && /^\d{8}$/.test(value),
			),
			sexe: this.sourceText('sexe'),
			echelon: this.sourceText('echelon'),
			rangNational: this.sourceNumber('place', 3),
			pointsOfficiels: this.sourceNumber('points', 3),
		};
	}
}
