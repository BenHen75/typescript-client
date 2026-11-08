import { DateTime } from 'luxon';

import { FfttError } from '#errors/fftt_error';

/** Parse a civil FFTT date without using the current time as a fallback. */
export function parseFfttDate(value: unknown): string | null {
	if (
		value === undefined ||
		value === null ||
		value === '' ||
		value === '00/00/0000'
	)
		return null;
	if (typeof value !== 'string') throw new FfttError('FFTT_INVALID_DATE');
	const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
	const iso = match ? `${match[3]}-${match[2]}-${match[1]}` : value;
	if (
		!/^\d{4}-\d{2}-\d{2}$/.test(iso) ||
		!DateTime.fromISO(iso, { zone: 'Europe/Paris' }).isValid
	)
		throw new FfttError('FFTT_INVALID_DATE');
	return iso;
}

export function parseSheetClassification(value: unknown): {
	gender: 'M' | 'F' | null;
	points: number | null;
} {
	if (
		value !== null &&
		value !== undefined &&
		typeof value !== 'string' &&
		typeof value !== 'number'
	)
		throw new FfttError('FFTT_INVALID_DATA');
	if (typeof value === 'number' && !Number.isFinite(value))
		throw new FfttError('FFTT_INVALID_NUMBER');
	const text = String(value ?? '').trim();
	const gender = /(?:^|\s)([MF])(?=\s|\d|$)/.exec(text)?.[1] as
		| 'M'
		| 'F'
		| undefined;
	const points = /(?:^|\s|[MF])(\d+(?:[.,]\d+)?)\s*(?:pts?)?$/i.exec(text)?.[1];
	return {
		gender: gender ?? null,
		points: points === undefined ? null : Number(points.replace(',', '.')),
	};
}

export function parseFfttSets(detail: string): Array<[number, number]> {
	const text = detail.trim();
	if (!text || text === '-') return [];
	if (!/^-?\d+(?:\s+-?\d+)*$/.test(text))
		throw new FfttError('FFTT_INVALID_SETS');
	return text.split(/\s+/).map((token) => {
		const points = Math.abs(Number(token));
		if (!Number.isSafeInteger(points)) throw new FfttError('FFTT_INVALID_SETS');
		const winnerPoints = points < 10 ? 11 : points + 2;
		return token.startsWith('-')
			? [points, winnerPoints]
			: [winnerPoints, points];
	});
}

/** A dash means an unknown match score; game scores handle their own dash. */
export function parseFfttMatchScore(value: unknown): number | null | undefined {
	if (value === undefined) return undefined;
	if (value === null || value === '' || value === '-') return null;
	if (
		typeof value !== 'number' &&
		(typeof value !== 'string' || !/^\d+$/.test(value))
	)
		throw new FfttError('FFTT_INVALID_SCORE');
	const score = Number(value);
	if (!Number.isSafeInteger(score) || score < 0)
		throw new FfttError('FFTT_INVALID_SCORE');
	return score;
}
