import { DateTime } from 'luxon';

import { BaseModel } from '#models/base_model';
import { parseFfttMatchScore } from '#utils/match_source';
import * as vt from '#utils/value_transformer';

export interface ParametresAccesAuDetail {
	is_retour?: boolean | undefined;
	phase?: number | undefined;
	res_1?: number | undefined;
	res_2?: number | undefined;
	equip_1?: string | undefined;
	equip_2?: string | undefined;
	equip_id1?: number | undefined;
	equip_id2?: number | undefined;
}

export class Rencontre extends BaseModel {
	readonly #id: number;

	readonly #libelle: string;

	readonly #equipeA: string | undefined;

	readonly #equipeB: string | undefined;

	readonly #scoreEquipeA: number | null | undefined;

	readonly #scoreEquipeB: number | null | undefined;

	readonly #lien: string;

	readonly #datePrevue: DateTime | undefined;

	readonly #dateReelle: DateTime | undefined;

	readonly #numeroClubA: string | undefined;

	readonly #numeroClubB: string | undefined;

	readonly #idPoule: number | null | undefined;

	readonly #isLive: boolean;

	readonly #parametresAccesAuDetail: ParametresAccesAuDetail;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#libelle = vt.string(data['libelle']);
		this.#equipeA = vt.stringIfDefined(data['equa']);
		this.#equipeB = vt.stringIfDefined(data['equb']);
		this.#scoreEquipeA = parseFfttMatchScore(data['scorea']);
		this.#scoreEquipeB = parseFfttMatchScore(data['scoreb']);
		this.#lien = vt.string(data['lien']);
		const planned = this.datePrevueIso,
			actual = this.dateReelleIso;
		this.#datePrevue = planned
			? DateTime.fromISO(planned, { zone: 'Europe/Paris' })
			: undefined;
		this.#dateReelle = actual
			? DateTime.fromISO(actual, { zone: 'Europe/Paris' })
			: undefined;
		this.#numeroClubA = vt.stringIfDefined(data['ncluba']);
		this.#numeroClubB = vt.stringIfDefined(data['nclubb']);
		this.#idPoule = this.sourceNumber('poule');
		this.#isLive = vt.string(data['live']) === '1';

		const parsed = new URLSearchParams(vt.string(data['lien']));
		const numberParam = (key: string) => {
			const text = parsed.get(key);
			return text === null || text === ''
				? undefined
				: (parseFfttMatchScore(text) ?? undefined);
		};
		const textParam = (key: string) => parsed.get(key) ?? undefined;

		this.#id = vt.number(parsed.get('renc_id'));
		this.#parametresAccesAuDetail = {
			is_retour:
				parsed.get('is_retour') === null || parsed.get('is_retour') === ''
					? undefined
					: parsed.get('is_retour') === '1',
			phase: numberParam('phase'),
			res_1: numberParam('res_1'),
			res_2: numberParam('res_2'),
			equip_1: textParam('equip_1'),
			equip_2: textParam('equip_2'),
			equip_id1: numberParam('equip_id1'),
			equip_id2: numberParam('equip_id2'),
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

	get datePrevueIso() {
		return this.sourceDate('dateprevue');
	}

	get dateReelleIso() {
		return this.sourceDate('datereelle');
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
