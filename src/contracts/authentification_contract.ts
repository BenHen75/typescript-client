export interface AuthentificationContract {
	/**
	 * Endpoint : xml_initialisation.php
	 * ---------------------------------------------------------
	 * Vérifie et crée un nouvel utilisateur pour l'application.
	 */
	authentifier(): Promise<boolean>;
}
