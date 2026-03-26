export function enumKey<E extends Record<string, string>>(
	enumObject: E,
	value: E[keyof E],
): keyof E | undefined {
	return Object.keys(enumObject).find(
		(key) => enumObject[key as keyof E] === value,
	);
}

export function enumLabel<
	E extends EnumObject,
	D extends Record<EnumKey<E>, string>,
>(enumObject: E, enumDictionary: D, value: EnumValue<E>): string {
	return enumDictionary[enumKey(enumObject, value)!];
}

export type EnumObject = Readonly<Record<string, string>>;
export type EnumValue<E extends EnumObject> = E[keyof E];
export type EnumKey<E extends EnumObject> = keyof E;
