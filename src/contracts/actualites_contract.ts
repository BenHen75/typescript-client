import type { Actualite } from '#models/divers/actualite';

export interface ActualitesContract {
	/**
	 * Endpoint : xml_new_actu.php
	 * ---------------------------------------------------------
	 * Renvoie le flux d’actualités de la FFTT.
	 */
	fluxActualitesFederation(): Promise<Array<Actualite>>;
}
