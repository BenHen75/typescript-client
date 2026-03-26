import { BaseModel } from '#models/base_model';
import { JoueurRencontre } from '#models/epreuve/par_equipes/rencontre/joueur_rencontre';
import { PartieRencontre } from '#models/epreuve/par_equipes/rencontre/partie_rencontre';
import { ResultatRencontre } from '#models/epreuve/par_equipes/rencontre/resultat_rencontre';

interface ConstructorProps {
	resultat: Record<string, unknown>;
	joueur: Array<Record<string, unknown>>;
	partie: Array<Record<string, unknown>>;
}

export class DetailRencontre extends BaseModel {
	readonly #resultat: ResultatRencontre;

	readonly #joueurs: Array<JoueurRencontre>;

	readonly #parties: Array<PartieRencontre>;

	constructor(data: ConstructorProps) {
		super();

		this.#resultat = new ResultatRencontre(data.resultat);
		this.#joueurs = data.joueur.map((joueur) => new JoueurRencontre(joueur));
		this.#parties = data.partie.map((partie) => new PartieRencontre(partie));
	}

	get resultat() {
		return this.#resultat;
	}

	get joueurs() {
		return this.#joueurs;
	}

	get parties() {
		return this.#parties;
	}
}
