import { FfttError } from '#errors/fftt_error';
import { parseFfttDate } from '#utils/match_source';

type PreloadMethod = () => Promise<void>;
export type Preloads<T extends string> = Record<T, PreloadMethod>;

export abstract class BaseModel {
	readonly #source: Readonly<Record<string, unknown>>;

	constructor(source: Record<string, unknown> = {}) {
		this.#source = Object.freeze({ ...source });
	}

	/** Preserve omitted fields separately from values explicitly cleared by FFTT. */
	hasSourceField(key: string): boolean {
		return Object.hasOwn(this.#source, key);
	}

	protected sourceText(key: string): string | null | undefined {
		if (!this.hasSourceField(key)) return undefined;
		const value = this.#source[key];
		if (value === null || value === '') return null;
		if (typeof value !== 'string' || value.length > 1000)
			throw new FfttError('FFTT_INVALID_DATA');
		return value.trim() || null;
	}

	protected sourceNumber(
		key: string,
		maxDecimalPlaces?: number,
	): number | null | undefined {
		if (!this.hasSourceField(key)) return undefined;
		const value = this.#source[key];
		if (value === null || value === '') return null;
		if (typeof value === 'number' && Number.isFinite(value)) {
			if (
				maxDecimalPlaces !== undefined &&
				Math.abs(
					value * 10 ** maxDecimalPlaces -
						Math.round(value * 10 ** maxDecimalPlaces),
				) > 1e-6
			)
				throw new FfttError('FFTT_INVALID_NUMBER');
			return value;
		}
		if (
			typeof value !== 'string' ||
			!/^[+-]?\d+(?:[.,]\d*)?$/.test(value.trim())
		) {
			throw new FfttError('FFTT_INVALID_NUMBER');
		}
		if (
			maxDecimalPlaces !== undefined &&
			(value.trim().split(/[.,]/)[1]?.length ?? 0) > maxDecimalPlaces
		)
			throw new FfttError('FFTT_INVALID_NUMBER');
		const result = Number(value.trim().replace(',', '.'));
		if (!Number.isFinite(result)) throw new FfttError('FFTT_INVALID_NUMBER');
		return result;
	}

	protected sourceDate(key: string): string | null | undefined {
		if (!this.hasSourceField(key)) return undefined;
		return parseFfttDate(this.#source[key]);
	}

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
