import { FfttError } from '#errors/fftt_error';
import { BaseModel } from '#models/base_model';
import { separerNomPrenom } from '#utils/joueur_utils';
import * as vt from '#utils/value_transformer';

export class Partie extends BaseModel {
	readonly #libelle: string;

	readonly #nomGagnant: string;

	readonly #prenomGagnant: string;

	readonly #nomPerdant: string;

	readonly #prenomPerdant: string;

	readonly #gagneParForfait: boolean | null;

	constructor(data: Record<string, unknown>) {
		super(data);

		this.#libelle = vt.string(data['libelle']);
		[this.#nomGagnant, this.#prenomGagnant] = separerNomPrenom(
			vt.string(data['vain']),
		);
		[this.#nomPerdant, this.#prenomPerdant] = separerNomPrenom(
			vt.string(data['perd']),
		);
		const forfait = this.sourceText('forfait');
		if (forfait != null && !['0', '1', '(F)'].includes(forfait)) {
			throw new FfttError('FFTT_INVALID_DATA');
		}
		this.#gagneParForfait =
			forfait == null ? null : forfait === '1' || forfait === '(F)';
	}

	get libelle() {
		return this.#libelle;
	}

	get nomGagnant() {
		return this.#nomGagnant;
	}

	get nomCompletGagnant() {
		return this.sourceText('vain') ?? null;
	}

	get nomCompletPerdant() {
		return this.sourceText('perd') ?? null;
	}

	get prenomGagnant() {
		return this.#prenomGagnant;
	}

	get nomPerdant() {
		return this.#nomPerdant;
	}

	get prenomPerdant() {
		return this.#prenomPerdant;
	}

	get gagneParForfait() {
		return this.#gagneParForfait;
	}
}
