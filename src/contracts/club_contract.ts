import type { TypeEquipe } from '#enums/type_equipe';
import type { Club } from '#models/club/club';
import type { DetailClub } from '#models/club/detail_club';
import type { Equipe } from '#models/club/equipe';

export interface ClubContract {
	/**
	 * Endpoint : xml_club_dep2.php
	 * ---------------------------------------------------------
	 * Renvoie une liste de clubs pour un département.
	 *
	 * @param departement
	 */
	clubsParDepartement(departement: string): Promise<Array<Club>>;

	/**
	 * Endpoint : xml_club_b.php
	 * ---------------------------------------------------------
	 * Renvoie une liste de clubs par rapport à un code postal.
	 *
	 * @param codePostal
	 */
	clubsParCodePostal(codePostal: string): Promise<Array<Club>>;

	/**
	 * Endpoint : xml_club_b.php
	 * ---------------------------------------------------------
	 * Renvoie une liste de clubs par rapport à une ville.
	 *
	 * @param ville
	 */
	clubsParVille(ville: string): Promise<Array<Club>>;

	/**
	 * Endpoint : xml_club_b.php
	 * ---------------------------------------------------------
	 * Renvoie une liste de clubs par rapport à un nom.
	 *
	 * @param nom
	 */
	clubsParNom(nom: string): Promise<Array<Club>>;

	/**
	 * Endpoint : xml_club_detail.php
	 * ---------------------------------------------------------
	 * Renvoie le détail pour un club.
	 *
	 * @param code
	 * @param idEquipe
	 */
	detailClub(code: string, idEquipe?: string): Promise<DetailClub | undefined>;

	/**
	 * Endpoint : xml_equipe.php
	 * ---------------------------------------------------------
	 * Renvoie une liste des équipes d’un club.
	 *
	 * @param code
	 * @param typeEquipe
	 */
	equipesClub(code: string, typeEquipe: TypeEquipe): Promise<Array<Equipe>>;
}
