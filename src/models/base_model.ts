type PreloadMethod = () => Promise<void>;
export type Preloads<T extends string> = Record<T, PreloadMethod>;

export abstract class BaseModel {
	protected async preloadRelations<T extends string>(
		relations: Array<T> | '*',
		getters: Preloads<T>,
	) {
		if (relations === '*') {
			await Promise.allSettled(
				Object.values<PreloadMethod>(getters).map((getter) => getter()),
			);

			return;
		}

		const toExecute: Array<PreloadMethod> = [];

		for (const relation of relations) {
			if (relation in getters) {
				toExecute.push(getters[relation]);
			}
		}

		await Promise.allSettled(toExecute.map((getter) => getter()));
	}
}
