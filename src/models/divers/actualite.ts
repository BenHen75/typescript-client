import type { DateTime } from 'luxon';

import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

export class Actualite extends BaseModel {
	readonly #date: DateTime;

	readonly #titre: string;

	readonly #description: string;

	readonly #url: string;

	readonly #photo: string;

	readonly #categorie: string;

	constructor(data: Record<string, unknown>) {
		super();

		this.#date = vt.date(data['date'], DATE_FORMAT.WITH_TIME);
		this.#titre = vt.string(data['titre']);
		this.#description = vt.string(data['description']);
		this.#url = vt.string(data['url']);
		this.#photo = vt.string(data['photo']);
		this.#categorie = vt.string(data['categorie']);
	}

	get date() {
		return this.#date;
	}

	get titre() {
		return this.#titre;
	}

	get description() {
		return this.#description;
	}

	get url() {
		return this.#url;
	}

	get photo() {
		return this.#photo;
	}

	get categorie() {
		return this.#categorie;
	}
}
