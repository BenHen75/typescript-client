import { DateTime } from 'luxon';

import { FfttError } from '#errors/fftt_error';
import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';

export class Groupe extends BaseModel {
	readonly #libelle: string;

	readonly #idEpreuve: number;

	readonly #idDivision: number;

	readonly #id: number;

	readonly #date: DateTime | null;

	readonly #dateISO: string | null;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#libelle = vt.string(data['libelle']);
		this.#dateISO = this.sourceDate('date') ?? null;
		this.#date = this.#dateISO
			? DateTime.fromISO(this.#dateISO, { zone: 'Europe/Paris' })
			: null;

		const link = this.sourceText('lien');
		if (!link || /[?#]/.test(link)) throw new FfttError('FFTT_INVALID_DATA');
		const parsed = new URLSearchParams(link);
		const identifier = (key: string) => {
			const values = parsed.getAll(key);
			const value = values[0];
			if (values.length !== 1 || !value || !/^\d+$/.test(value))
				throw new FfttError('FFTT_INVALID_DATA');
			const id = Number(value);
			if (!Number.isSafeInteger(id) || id <= 0 || id > 2147483647)
				throw new FfttError('FFTT_INVALID_DATA');
			return id;
		};

		this.#idEpreuve = identifier('epr');
		this.#idDivision = identifier('res_division');
		this.#id = identifier('cx_tableau');
	}

	get libelle() {
		return this.#libelle;
	}

	get idEpreuve() {
		return this.#idEpreuve;
	}

	get idDivision() {
		return this.#idDivision;
	}

	get id() {
		return this.#id;
	}

	get date() {
		return this.#date;
	}

	get dateISO() {
		return this.#dateISO;
	}
}
