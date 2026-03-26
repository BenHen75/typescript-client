import type { Classement } from '#models/epreuve/individuelle/classement';
import type { Groupe } from '#models/epreuve/individuelle/groupe';
import type { Partie } from '#models/epreuve/individuelle/partie';

export interface EpreuveIndividuelleContract {
	/**
	 * Endpoint : xml_result_indiv.php
	 * ---------------------------------------------------------
	 * Renvoie les différents groupes d’une épreuve individuelle.
	 *
	 * @param epreuveId
	 * @param divisionId
	 */
	rechercherGroupes(
		epreuveId: number,
		divisionId: number,
	): Promise<Array<Groupe>>;

	/**
	 * Endpoint : xml_result_indiv.php
	 * ---------------------------------------------------------
	 * Renvoie les différentes parties d’un tour d'une épreuve individuelle.
	 *
	 * @param epreuveId
	 * @param divisionId
	 * @param groupeId
	 */
	recupererParties(
		epreuveId: number,
		divisionId: number,
		groupeId?: number,
	): Promise<Array<Partie>>;

	/**
	 * Endpoint : xml_result_indiv.php
	 * ---------------------------------------------------------
	 * Renvoie le classement d’un tour d'une épreuve individuelle.
	 *
	 * @param epreuveId
	 * @param divisionId
	 * @param groupeId
	 */
	recupererClassement(
		epreuveId: number,
		divisionId: number,
		groupeId?: number,
	): Promise<Array<Classement>>;

	/**
	 * Endpoint : xml_res_cla.php
	 * ---------------------------------------------------------
	 * Renvoie le classement général d’une division du critérium fédéral.
	 *
	 * @param divisionId
	 */
	recupererClassementCriterium(divisionId: number): Promise<Array<Classement>>;
}
