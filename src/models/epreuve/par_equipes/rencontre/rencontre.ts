import type { DateTime } from 'luxon';

import { BaseModel } from '#models/base_model';
import * as vt from '#utils/value_transformer';
import { DATE_FORMAT } from '#utils/value_transformer';

interface ParametresAccesAuDetail {
	is_retour: boolean;
	phase: number;
	res_1: number;
	res_2: number;
	equip_1: string;
	equip_2: string;
	equip_id1: number;
	equip_id2: number;
}

export class Rencontre extends BaseModel {
	readonly #id: number;

	readonly #libelle: string;

	readonly #equipeA: string | undefined;

	readonly #equipeB: string | undefined;

	readonly #scoreEquipeA: number | undefined;

	readonly #scoreEquipeB: number | undefined;

	readonly #lien: string;

	readonly #datePrevue: DateTime;

	readonly #dateReelle: DateTime | undefined;

	readonly #numeroClubA: string | undefined;

	readonly #numeroClubB: string | undefined;

	readonly #idPoule: number;

	readonly #isLive: boolean;

	readonly #parametresAccesAuDetail: ParametresAccesAuDetail;

	constructor(data: Record<string, unknown>) {
		super();

		this.#libelle = vt.string(data['libelle']);
		this.#equipeA = vt.stringIfDefined(data['equa']);
		this.#equipeB = vt.stringIfDefined(data['equb']);
		this.#scoreEquipeA = vt.numberIfDefined(data['scorea']);
		this.#scoreEquipeB = vt.numberIfDefined(data['scoreb']);
		this.#lien = vt.string(data['lien']);
		this.#datePrevue = vt.date(data['dateprevue'], DATE_FORMAT.DEFAULT);
		this.#dateReelle = vt.dateIfDefined(
			data['datereelle'],
			DATE_FORMAT.DEFAULT,
		);
		this.#numeroClubA = vt.stringIfDefined(data['ncluba']);
		this.#numeroClubB = vt.stringIfDefined(data['nclubb']);
		this.#idPoule = vt.number(data['poule']);
		this.#isLive = vt.string(data['live']) === '1';

		const parsed = new URLSearchParams(vt.string(data['lien']));

		this.#id = vt.number(parsed.get('renc_id'));
		this.#parametresAccesAuDetail = {
			is_retour: vt.string(parsed.get('is_retour')) === '1',
			phase: vt.number(parsed.get('phase')),
			res_1: vt.number(parsed.get('res_1')),
			res_2: vt.number(parsed.get('res_2')),
			equip_1: vt.string(parsed.get('equip_1')),
			equip_2: vt.string(parsed.get('equip_2')),
			equip_id1: vt.number(parsed.get('equip_id1')),
			equip_id2: vt.number(parsed.get('equip_id2')),
		};
	}

	get id() {
		return this.#id;
	}

	get libelle() {
		return this.#libelle;
	}

	get equipeA() {
		return this.#equipeA;
	}

	get equipeB() {
		return this.#equipeB;
	}

	get scoreEquipeA() {
		return this.#scoreEquipeA;
	}

	get scoreEquipeB() {
		return this.#scoreEquipeB;
	}

	get lien() {
		return this.#lien;
	}

	get datePrevue() {
		return this.#datePrevue;
	}

	get dateReelle() {
		return this.#dateReelle;
	}

	get numeroClubA() {
		return this.#numeroClubA;
	}

	get numeroClubB() {
		return this.#numeroClubB;
	}

	get idPoule() {
		return this.#idPoule;
	}

	get isLive() {
		return this.#isLive;
	}

	get parametresAccesAuDetail() {
		return this.#parametresAccesAuDetail;
	}
}
