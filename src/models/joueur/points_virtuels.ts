import { BaseModel } from '#models/base_model';

export class PointsVirtuels extends BaseModel {
	#parties = 0;

	#victoires = 0;

	#defaites = 0;

	#forfaits = 0;

	#performances = 0;

	#contrePerformances = 0;

	#estimation = 0;

	victoire(points: number, isPerformance: boolean) {
		this.#parties++;
		this.#victoires++;
		this.#estimation += points;

		if (isPerformance) {
			this.#performances++;
		}
	}

	defaite(points: number, isContrePerformance: boolean) {
		this.#parties++;
		this.#defaites++;
		this.#estimation += points;

		if (isContrePerformance) {
			this.#contrePerformances++;
		}
	}

	forfait() {
		this.#parties++;
		this.#forfaits++;
	}

	get parties() {
		return this.#parties;
	}

	get victoires() {
		return this.#victoires;
	}

	get defaites() {
		return this.#defaites;
	}

	get forfaits() {
		return this.#forfaits;
	}

	get estimation() {
		return this.#estimation;
	}

	get performances() {
		return this.#performances;
	}

	get contrePerformances() {
		return this.#contrePerformances;
	}
}
