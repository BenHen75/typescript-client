import type { EquipePoule } from '#models/epreuve/par_equipes/poule/equipe_poule';
import type { Poule } from '#models/epreuve/par_equipes/poule/poule';
import type { DetailRencontre } from '#models/epreuve/par_equipes/rencontre/detail_rencontre';
import type { Rencontre } from '#models/epreuve/par_equipes/rencontre/rencontre';

export interface EpreuveParEquipeContract {
	/**
	 * Endpoint : xml_result_equ.php
	 * ---------------------------------------------------------
	 * Renvoie la liste des poules d'une division de championnat
	 * par équipes.
	 *
	 * @param divisionId
	 */
	poulesPourDivision(divisionId: number): Promise<Array<Poule>>;

	/**
	 * Endpoint : xml_result_equ.php
	 * ---------------------------------------------------------
	 * Renvoie la liste des rencontres d'une poule de championnat
	 * par équipes.
	 *
	 * @param divisionId
	 * @param pouleId
	 */
	rencontresPourPoule(
		divisionId: number,
		pouleId?: number,
	): Promise<Array<Rencontre>>;

	/**
	 * Endpoint : xml_result_equ.php
	 * ---------------------------------------------------------
	 * Renvoie les équipes d'une poule de championnat par équipes
	 * dans l'ordre de la poule.
	 *
	 * @param divisionId
	 * @param pouleId
	 */
	ordrePoule(divisionId: number, pouleId?: number): Promise<Array<EquipePoule>>;

	/**
	 * Endpoint : xml_result_equ.php
	 * ---------------------------------------------------------
	 * Renvoie le classement d'une poule de championnat par équipes.
	 *
	 * @param divisionId
	 * @param pouleId
	 */
	classementPoule(
		divisionId: number,
		pouleId?: number,
	): Promise<Array<EquipePoule>>;

	/**
	 * Endpoint : xml_chp_renc.php
	 * ---------------------------------------------------------
	 * Renvoie les informations détaillées d’une rencontre.
	 *
	 * @param rencontreId
	 * @param extraParams
	 */
	detailRencontre(
		rencontreId: number,
		extraParams: {
			is_retour: boolean;
			phase: number;
			res_1: number;
			res_2: number;
			equip_1: string;
			equip_2: string;
			equip_id1: number;
			equip_id2: number;
		},
	): Promise<DetailRencontre | undefined>;
}
