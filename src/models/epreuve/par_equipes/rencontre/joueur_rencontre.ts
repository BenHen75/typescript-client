import { Sexe, SexeDict } from '#enums/sexe';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import { parseClassementJoueur } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';

export class JoueurRencontre extends BaseModel {
	readonly #joueurA: string | undefined;

	readonly #joueurB: string | undefined;

	readonly #pointsOfficielsA: number | undefined;

	readonly #pointsOfficielsB: number | undefined;

	readonly #rangNationalA: number | undefined;

	readonly #rangNationalB: number | undefined;

	readonly #sexeA: Sexe | undefined;

	readonly #sexeB: Sexe | undefined;

	constructor(data: Record<string, unknown>) {
		super();

		this.#joueurA = vt.string(data['xja']);
		this.#joueurB = vt.string(data['xjb']);

		const classementA = parseClassementJoueur(vt.string(data['xca']));
		this.#rangNationalA = classementA.numero;
		this.#sexeA = classementA.sexe;
		this.#pointsOfficielsA = classementA.points;

		const classementB = parseClassementJoueur(vt.string(data['xcb']));
		this.#rangNationalB = classementB.numero;
		this.#sexeB = classementB.sexe;
		this.#pointsOfficielsB = classementB.points;
	}

	get joueurA() {
		return this.#joueurA;
	}

	get joueurB() {
		return this.#joueurB;
	}

	get pointsOfficielsA() {
		return this.#pointsOfficielsA;
	}

	get pointsOfficielsB() {
		return this.#pointsOfficielsB;
	}

	get rangNationalA() {
		return this.#rangNationalA;
	}

	get rangNationalB() {
		return this.#rangNationalB;
	}

	get sexeA() {
		return this.#sexeA
			? {
					code: this.#sexeA,
					label: enumLabel(Sexe, SexeDict, this.#sexeA),
				}
			: undefined;
	}

	get sexeB() {
		return this.#sexeB
			? {
					code: this.#sexeB,
					label: enumLabel(Sexe, SexeDict, this.#sexeB),
				}
			: undefined;
	}
}
