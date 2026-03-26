import type { TypeOrganisme } from '#enums/type_organisme';
import type { Organisme } from '#models/organisme/organisme';

export interface OrganismeContract {
	/**
	 * Endpoint : xml_organisme.php
	 * ---------------------------------------------------------
	 * Renvoie une liste des organismes.
	 *
	 * @param orgType
	 */
	organismesParType(orgType: TypeOrganisme): Promise<Array<Organisme>>;

	/**
	 * Endpoint : xml_organisme.php
	 * ---------------------------------------------------------
	 * Cherche un organisme par son type et son identifiant.
	 *
	 * @param code
	 */
	organisme(code: string): Promise<Organisme | undefined>;

	/**
	 * Endpoint : xml_organisme.php
	 * ---------------------------------------------------------
	 * Cherche les organismes dépendants de l'organisme donné.
	 *
	 * @param code
	 */
	organismesEnfants(code: string): Promise<Array<Organisme>>;
}
