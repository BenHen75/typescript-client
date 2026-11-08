import { FfttError } from '#errors/fftt_error';
import { BaseModel } from '#models/base_model';
import { parseClassementJoueur, separerNomPrenom } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';

export class Classement extends BaseModel {
	readonly #rang: number | null;

	readonly #nom: string;

	readonly #prenom: string;

	readonly #numerote: boolean;

	readonly #numero: number | undefined;

	readonly #points: number | undefined;

	readonly #club: string;

	readonly #pointsCriterium: string | null;

	readonly #nomComplet: string;

	readonly #licenceSource: string | undefined;

	constructor(data: Record<string, unknown>) {
		super(data);

		const rank = this.sourceNumber('rang');
		if (rank != null && (!Number.isSafeInteger(rank) || rank < 0)) {
			throw new FfttError('FFTT_INVALID_DATA');
		}
		this.#rang = rank == null || rank === 0 ? null : rank;
		this.#nomComplet = this.sourceText('nom') ?? '';
		[this.#nom, this.#prenom] = separerNomPrenom(this.#nomComplet);
		this.#club = vt.string(data['club']);
		this.#pointsCriterium = this.sourceText('points') ?? null;
		const licences = [
			this.sourceText('licence'),
			this.sourceText('numlic'),
		].filter((value): value is string => value != null);
		if (
			new Set(licences).size > 1 ||
			licences.some((value) => !/^(?!0+$)\d{1,32}$/.test(value))
		) {
			throw new FfttError('FFTT_INVALID_DATA');
		}
		this.#licenceSource = licences[0];

		const parsed = parseClassementJoueur(vt.string(data['clt']));
		this.#numero = parsed.numero;
		this.#points = parsed.points;
		this.#numerote = this.#numero !== undefined;
	}

	get rang() {
		return this.#rang;
	}

	get nom() {
		return this.#nom;
	}

	get nomComplet() {
		return this.#nomComplet;
	}

	get licenceSource() {
		return this.#licenceSource;
	}

	get classementBrut() {
		return this.sourceText('clt') ?? null;
	}

	get clubSource() {
		return this.sourceText('club') ?? null;
	}

	get prenom() {
		return this.#prenom;
	}

	get numerote() {
		return this.#numerote;
	}

	get numero() {
		return this.#numero;
	}

	get points() {
		return this.#points;
	}

	get club() {
		return this.#club;
	}

	get pointsCriterium() {
		return this.#pointsCriterium;
	}
}
