import type { TypeEpreuve } from '#enums/type_epreuve';
import type { Division } from '#models/epreuve/division';
import type { Epreuve } from '#models/epreuve/epreuve';

export interface EpreuveContract {
	/**
	 * Endpoint : xml_epreuve.php
	 * ---------------------------------------------------------
	 * Renvoie une liste des épreuves pour un organisme.
	 *
	 * @param idOrganisme
	 * @param typeEpreuve
	 */
	rechercherEpreuves(
		idOrganisme: number,
		typeEpreuve: TypeEpreuve,
	): Promise<Array<Epreuve>>;

	/**
	 * Endpoint : xml_division.php
	 * ---------------------------------------------------------
	 * Renvoie une liste des divisions pour une épreuve donnée.
	 *
	 * @param idOrganisme
	 * @param idEpreuve
	 * @param typeEpreuve
	 */
	rechercherDivisionsPourEpreuve(
		idOrganisme: number,
		idEpreuve: number,
		typeEpreuve: TypeEpreuve,
	): Promise<Array<Division>>;
}
