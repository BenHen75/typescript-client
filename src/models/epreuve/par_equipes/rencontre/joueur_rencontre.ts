import { Sexe, SexeDict } from '#enums/sexe';
import { BaseModel } from '#models/base_model';
import { enumLabel } from '#utils/enum_utils';
import { parseClassementJoueur } from '#utils/joueur_utils';
import { parseSheetClassification } from '#utils/match_source';

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
		super(data);

		this.#joueurA = this.sourceText('xja') ?? undefined;
		this.#joueurB = this.sourceText('xjb') ?? undefined;

		const classementA = parseClassementJoueur(this.sourceText('xca') ?? '');
		const parsedA = parseSheetClassification(this.sourceText('xca'));
		this.#rangNationalA = classementA.numero;
		this.#sexeA = (parsedA.gender as Sexe | undefined) ?? undefined;
		this.#pointsOfficielsA = parsedA.points ?? undefined;

		const classementB = parseClassementJoueur(this.sourceText('xcb') ?? '');
		const parsedB = parseSheetClassification(this.sourceText('xcb'));
		this.#rangNationalB = classementB.numero;
		this.#sexeB = (parsedB.gender as Sexe | undefined) ?? undefined;
		this.#pointsOfficielsB = parsedB.points ?? undefined;
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
