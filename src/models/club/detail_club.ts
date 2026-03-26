import type { DateTime } from 'luxon';

import { BaseModel } from '#models/base_model';
import { Correspondant } from '#models/club/correspondant';
import { Salle } from '#models/club/salle';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

export class DetailClub extends BaseModel {
	readonly #id: string;

	readonly #numero: string;

	readonly #nom: string;

	readonly #siteInternet: string | undefined;

	readonly #salle: Salle;

	readonly #correspondant: Correspondant;

	readonly #dateValidation: DateTime | undefined;

	constructor(data: Record<string, unknown>) {
		super();

		this.#id = vt.string(data['idclub']);
		this.#numero = vt.string(data['numero']);
		this.#nom = vt.string(data['nom']);
		this.#siteInternet = vt.stringIfDefined(data['web']);
		this.#dateValidation = vt.dateIfDefined(
			data['validation'],
			DATE_FORMAT.DEFAULT,
		);

		this.#salle = new Salle({
			nom: vt.string(data['nomsalle']),
			ligneAdresse1: vt.string(data['adressesalle1']),
			codePostal: vt.string(data['codepsalle']),
			ville: vt.string(data['villesalle']),
			ligneAdresse2: vt.stringIfDefined(data['adressesalle2']),
			ligneAdresse3: vt.stringIfDefined(data['adressesalle3']),
			latitude: vt.numberIfDefined(data['latitude']),
			longitude: vt.numberIfDefined(data['longitude']),
		});

		this.#correspondant = new Correspondant({
			nom: vt.string(data['nomcor']),
			prenom: vt.string(data['prenomcor']),
			email: vt.string(data['mailcor']),
			telephone: vt.string(data['telcor']),
		});
	}

	get id() {
		return this.#id;
	}

	get numero() {
		return this.#numero;
	}

	get nom() {
		return this.#nom;
	}

	get siteInternet() {
		return this.#siteInternet;
	}

	get salle() {
		return this.#salle;
	}

	get correspondant() {
		return this.#correspondant;
	}

	get dateValidation() {
		return this.#dateValidation;
	}
}
