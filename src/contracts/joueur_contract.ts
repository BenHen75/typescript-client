import type { TypeLicence } from '#enums/type_licence';
import type { DetailJoueur } from '#models/joueur/detail_joueur';
import type { DetailJoueurBaseClassement } from '#models/joueur/detail_joueur_base_classement';
import type { DetailJoueurBaseSPID } from '#models/joueur/detail_joueur_base_spid';
import type { HistoriqueClassement } from '#models/joueur/historique_classement';
import type { JoueurBaseClassement } from '#models/joueur/joueur_base_classement';
import type { JoueurBaseSPID } from '#models/joueur/joueur_base_spid';
import type { PointsVirtuels } from '#models/joueur/points_virtuels';
import type { Partie } from '#models/partie/partie';
import type { PartieBaseClassement } from '#models/partie/partie_base_classement';
import type { PartieBaseSPID } from '#models/partie/partie_base_spid';

export interface JoueurContract {
	/**
	 * Endpoint : xml_liste_joueur.php
	 * ---------------------------------------------------------
	 * Cherche un ou plusieurs joueur(s) par leur nom (et prénom éventuellement) sur la base classement.
	 *
	 * @param nom
	 * @param prenom
	 */
	joueursParNomSurBaseClassement(
		nom: string,
		prenom?: string,
	): Promise<Array<JoueurBaseClassement>>;

	/**
	 * Endpoint : xml_liste_joueur_o.php
	 * ---------------------------------------------------------
	 * Cherche un ou plusieurs joueur(s) par leur nom (et prénom éventuellement) sur la base SPID.
	 *
	 * @param nom
	 * @param prenom
	 * @param valide Filtrer uniquement sur les licences de la saison en cours
	 */
	joueursParNomSurBaseSPID(
		nom: string,
		prenom?: string,
		valide?: boolean,
	): Promise<Array<JoueurBaseSPID>>;

	/**
	 * Endpoint : xml_liste_joueur_o.php
	 * ---------------------------------------------------------
	 * Cherche un ou plusieurs joueur(s) par leur nom (et prénom éventuellement).
	 *
	 * @param nom
	 * @param prenom
	 * @param valide Filtrer uniquement sur les licences de la saison en cours
	 */
	joueursParNom(
		nom: string,
		prenom?: string,
		valide?: boolean,
	): Promise<Array<JoueurBaseSPID>>;

	/**
	 * Endpoint : xml_liste_joueur.php
	 * ---------------------------------------------------------
	 * Cherche un ou plusieurs joueur(s) par leur numéro de club sur la base classement.
	 *
	 * @param numeroClub
	 */
	joueursParClubSurBaseClassement(
		numeroClub: string,
	): Promise<Array<JoueurBaseClassement>>;

	/**
	 * Endpoint : xml_liste_joueur_o.php
	 * ---------------------------------------------------------
	 * Cherche un ou plusieurs joueur(s) par leur numéro de club sur la base SPID.
	 *
	 * @param numeroClub
	 * @param valide Filtrer uniquement sur les licences de la saison en cours
	 */
	joueursParClubSurBaseSPID(
		numeroClub: string,
		valide?: boolean,
	): Promise<Array<JoueurBaseSPID>>;

	/**
	 * Endpoint : xml_licence_b.php
	 * ---------------------------------------------------------
	 * Cherche un ou plusieurs joueur(s) par leur numéro de club.
	 *
	 * @param numeroClub
	 */
	joueursParClub(numeroClub: string): Promise<Array<DetailJoueur>>;

	/**
	 * Endpoint : xml_licence_b.php
	 * ---------------------------------------------------------
	 * Cherche un ou plusieurs joueur(s) par leur numéro de club et leur type de licence.
	 *
	 * @param numeroClub
	 * @param typesLicence
	 */
	joueursParClubEtType(
		numeroClub: string,
		typesLicence: Array<TypeLicence>,
	): Promise<Array<DetailJoueur>>;

	/**
	 * Endpoint : xml_joueur.php
	 * ---------------------------------------------------------
	 * Cherche un joueur par son numéro de licence sur la base classement.
	 *
	 * @param licence
	 */
	joueurParLicenceSurBaseClassement(
		licence: string,
	): Promise<DetailJoueurBaseClassement | undefined>;

	/**
	 * Endpoint : xml_licence.php
	 * ---------------------------------------------------------
	 * Cherche un joueur par son numéro de licence sur la base SPID.
	 *
	 * @param licence
	 */
	joueurParLicenceSurBaseSPID(
		licence: string,
	): Promise<DetailJoueurBaseSPID | undefined>;

	/**
	 * Endpoint : xml_licence_b.php
	 * ---------------------------------------------------------
	 * Cherche un joueur par son numéro de licence sur les bases SPID et classement.
	 *
	 * @param licence
	 */
	joueurParLicence(licence: string): Promise<DetailJoueur | undefined>;

	/**
	 * Endpoint : xml_partie_mysql.php
	 * ---------------------------------------------------------
	 * Renvoie la liste des parties de la base classement d’un joueur.
	 *
	 * @param licence
	 */
	historiquePartiesBaseClassement(
		licence: string,
	): Promise<Array<PartieBaseClassement>>;

	/**
	 * Endpoint : xml_partie.php
	 * ---------------------------------------------------------
	 * Renvoie la liste des parties de la base SPID d’un joueur.
	 *
	 * @param licence
	 */
	historiquePartiesBaseSPID(licence: string): Promise<Array<PartieBaseSPID>>;

	/**
	 * Endpoint : xml_partie.php
	 * ---------------------------------------------------------
	 * Renvoie une liste des parties d’un joueur.
	 *
	 * @param licence
	 */
	historiqueParties(licence: string): Promise<Array<Partie>>;

	/**
	 * Endpoint : xml_histo_classement.php
	 * ---------------------------------------------------------
	 * Renvoie une liste des parties d’un joueur.
	 *
	 * @param licence
	 */
	historiqueClassementOfficiel(
		licence: string,
	): Promise<Array<HistoriqueClassement>>;

	/**
	 * Renvoie une liste des parties validées d’un joueur.
	 *
	 * @param licence
	 */
	partiesValidees(licence: string): Promise<Array<Partie>>;

	/**
	 * Renvoie une liste des parties non-validées d’un joueur.
	 *
	 * @param licence
	 */
	partiesNonValidees(licence: string): Promise<Array<Partie>>;

	/**
	 * Renvoie le nombre de points virtuels d’un joueur (estimation).
	 *
	 * @param licence
	 */
	pointsVirtuels(licence: string): Promise<PointsVirtuels | undefined>;

	/**
	 * Renvoie le nombre de points virtuels d’un joueur (estimation) sur une période donnée.
	 *
	 * @param licence
	 * @param debut - Date de début de la période (jj/mm/aaaa)
	 * @param fin - Date de fin de la période (jj/mm/aaaa)
	 */
	pointsVirtuelsSurPeriode(
		licence: string,
		debut: string,
		fin: string,
	): Promise<PointsVirtuels | undefined>;
}
