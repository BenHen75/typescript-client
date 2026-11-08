import { FfttError } from '#errors/fftt_error';

type SourceRecord = Record<string, unknown>;
const record = (value: unknown): value is SourceRecord =>
	!!value && typeof value === 'object' && !Array.isArray(value);

function sourceList(response: unknown): SourceRecord | '' {
	if (!record(response)) throw new FfttError('FFTT_INVALID_RESPONSE');
	if (response['liste'] === '') return '';
	if (!record(response['liste'])) throw new FfttError('FFTT_INVALID_RESPONSE');
	return response['liste'];
}

/** Empty lists, singleton objects and arrays share one collection contract. */
export function sourceCollection(
	response: unknown,
	key: string,
	options: { optional?: boolean } = {},
): Array<SourceRecord> {
	const list = sourceList(response);
	if (list === '') return [];
	if (!(key in list)) {
		if (options.optional) return [];
		throw new FfttError('FFTT_INVALID_RESPONSE');
	}
	const value = list[key];
	if (value === '') return [];
	const rows = Array.isArray(value) ? value : [value];
	if (rows.length > 5000 || rows.some((row) => !record(row))) {
		throw new FfttError('FFTT_INVALID_RESPONSE');
	}
	return rows as Array<SourceRecord>;
}

export function sourceRecord(
	response: unknown,
	key: string,
): SourceRecord | undefined {
	const list = sourceList(response);
	if (list === '') return undefined;
	const value = list[key];
	if (!record(value)) throw new FfttError('FFTT_INVALID_RESPONSE');
	return value;
}
