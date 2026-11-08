import { DateTime } from 'luxon';

import { Sexe, SexeDict } from '#enums/sexe';
import { BaseModel } from '#models/base_model';
import {
	sourceIdentifier,
	sourceVictory,
	sourceForfeit,
	sourceOpponentPoints,
	type DonneesPartieOfficielle,
} from '#models/partie/official_fields';
import { enumLabel } from '#utils/enum_utils';
import { separerNomPrenom } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

export class PartieBaseClassement extends BaseModel {
	readonly #licence: string;

	readonly #licenceAdversaire: string;

	readonly #victoire: boolean;

	readonly #numeroJournee: number | undefined;

	readonly #codeChampionnat: string;

	readonly #date: DateTime;

	readonly #sexeAdversaire: Sexe | undefined;

	readonly #nomAdversaire: string;

	readonly #prenomAdversaire: string;

	readonly #adversaireNumerote: boolean;

	readonly #numeroAdversaire: number | undefined;

	readonly #pointsObtenus: number;

	readonly #coefficient: number;

	readonly #classementAdversaire: number | undefined;

	readonly #id: number;

	readonly #valide: boolean;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#valide = true;
		this.#licence = vt.string(data['licence']);
		this.#licenceAdversaire = vt.string(data['advlic']);
		this.#victoire = vt.string(data['vd']) === 'V';
		this.#numeroJournee = vt.numberIfDefined(data['numjourn']);
		this.#codeChampionnat = vt.string(data['codechamp']);
		this.#date =
			vt.dateIfDefined(data['date'], DATE_FORMAT.DEFAULT) ??
			DateTime.invalid('Missing date');
		this.#sexeAdversaire = vt.picklistIfDefined(data['advsexe'], Sexe);
		[this.#nomAdversaire, this.#prenomAdversaire] = separerNomPrenom(
			vt.string(data['advnompre']),
		);
		this.#pointsObtenus = vt.number(data['pointres']);
		this.#coefficient = vt.number(data['coefchamp']);
		this.#id = vt.number(data['idpartie']);

		const advclaof = vt.string(data['advclaof']);
		if (advclaof.startsWith('N')) {
			this.#adversaireNumerote = true;
			this.#numeroAdversaire = Number(advclaof.slice(1));
		} else {
			this.#adversaireNumerote = false;
			this.#classementAdversaire = Number(advclaof);
		}
	}

	get licence() {
		return this.#licence;
	}

	get licenceAdversaire() {
		return this.#licenceAdversaire;
	}

	get victoire() {
		return this.#victoire;
	}

	get numeroJournee() {
		return this.#numeroJournee;
	}

	get codeChampionnat() {
		return this.#codeChampionnat;
	}

	get date() {
		return this.#date;
	}

	get sexeAdversaire() {
		return {
			code: this.#sexeAdversaire,
			label:
				this.#sexeAdversaire === undefined
					? undefined
					: enumLabel(Sexe, SexeDict, this.#sexeAdversaire),
		};
	}

	get nomAdversaire() {
		return this.#nomAdversaire;
	}

	get prenomAdversaire() {
		return this.#prenomAdversaire;
	}

	get adversaireNumerote() {
		return this.#adversaireNumerote;
	}

	get numeroAdversaire() {
		return this.#numeroAdversaire;
	}

	get pointsObtenus() {
		return this.#pointsObtenus;
	}

	get coefficient() {
		return this.#coefficient;
	}

	get classementAdversaire() {
		return this.#classementAdversaire;
	}

	get id() {
		return this.#id;
	}

	get valide() {
		return this.#valide;
	}
	/** Strict source projection is lazy so callers can isolate an invalid observation. */
	get donneesOfficielles(): DonneesPartieOfficielle {
		const coefficient = this.sourceNumber('coefchamp', 3);
		const journee = this.sourceNumber('numjourn', 3);
		return {
			idPartie: sourceIdentifier(this.sourceText('idpartie')),
			date: this.sourceDate('date') ?? null,
			licence: this.sourceText('licence') ?? null,
			licenceAdversaire: sourceIdentifier(this.sourceText('advlic')),
			nomAdversaire:
				this.sourceText('advnompre')?.replaceAll(/\s+/g, ' ') ?? null,
			pointsAdversaire: sourceOpponentPoints(this.sourceText('advclaof')),
			codeChampionnat: this.sourceText('codechamp') ?? null,
			epreuve: null,
			numeroJournee: journee === 0 ? null : (journee ?? null),
			coefficient: coefficient === 0 ? null : (coefficient ?? null),
			pointsObtenus: this.sourceNumber('pointres', 3) ?? null,
			victoire: sourceVictory(this.sourceText('vd')),
			forfait: sourceForfeit(this.sourceText('forfait')),
		};
	}
}
