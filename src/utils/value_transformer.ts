import { DateTime } from 'luxon';
import * as v from 'valibot';

import type { EnumObject, EnumValue } from '#utils/enum_utils';

export const DATE_FORMAT = {
	DEFAULT: 'dd/MM/yyyy',
	WITH_TIME: 'yyyy-MM-dd HH:mm:ss',
} as const;

export type DateFormat = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT];

export function string(value: unknown): string {
	const result = v.safeParse(v.pipe(v.string(), v.nonEmpty(), v.trim()), value);

	return result.success ? result.output : '';
}

export function number(value: unknown): number {
	if (typeof value === 'number')
		return Number.isFinite(value) ? value : Number.NaN;
	if (typeof value !== 'string' || !/^[+-]?\d+(?:[.,]\d*)?$/.test(value.trim()))
		return Number.NaN;
	return Number(value.trim().replace(',', '.'));
}

export function numberIfDefined(
	value: unknown,
	zeroIncluded = true,
): number | undefined {
	const result = number(value);
	return Number.isFinite(result) && (zeroIncluded || result !== 0)
		? result
		: undefined;
}

export function stringIfDefined(value: unknown): string | undefined {
	const result = v.safeParse(
		v.nullish(v.pipe(v.string(), v.nonEmpty(), v.trim())),
		value,
	);

	return result.success ? (result.output ?? undefined) : undefined;
}

export function date(
	value: unknown,
	format: DateFormat = DATE_FORMAT.DEFAULT,
): DateTime<true> {
	return v.parse(
		v.pipe(
			v.string(),
			v.nonEmpty(),
			v.transform((input) =>
				DateTime.fromFormat(input, format, {
					locale: 'fr-FR',
					zone: 'Europe/Paris',
				}),
			),
		),
		value,
	) as DateTime<true>;
}

export function dateIfDefined(
	value: unknown,
	format: DateFormat = DATE_FORMAT.DEFAULT,
): DateTime<true> | undefined {
	const result = v.safeParse(
		v.nullish(
			v.pipe(
				v.string(),
				v.nonEmpty(),
				v.transform((input) =>
					DateTime.fromFormat(input, format, {
						locale: 'fr-FR',
						zone: 'Europe/Paris',
					}),
				),
			),
		),
		value,
	);

	return result.success
		? ((result.output as DateTime<true>) ?? undefined)
		: undefined;
}

export function picklist<T extends EnumObject>(
	value: unknown,
	enumObject: T,
): EnumValue<T> {
	return v.parse(v.pipe(v.string(), v.enum(enumObject)), value);
}

export function picklistIfDefined<T extends EnumObject>(
	value: unknown,
	enumObject: T,
): EnumValue<T> | undefined {
	const result = v.safeParse(
		v.nullish(v.pipe(v.string(), v.enum(enumObject))),
		value,
	);

	return result.success ? (result.output ?? undefined) : undefined;
}

export function exists(value: unknown): boolean {
	return v.safeParse(v.pipe(v.string(), v.nonEmpty()), value).success;
}
