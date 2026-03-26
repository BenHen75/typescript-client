import type { EnumKey } from '#utils/enum_utils';

export const Nationalite = {
	FRANCAISE: 'F',
	COMMUNAUTE_EUROPEENNE: 'C',
	ETRANGERE: 'E',
} as const;

export type Nationalite = (typeof Nationalite)[keyof typeof Nationalite];

export const NationaliteDict = {
	FRANCAISE: 'Française',
	COMMUNAUTE_EUROPEENNE: 'Communauté européenne',
	ETRANGERE: 'Étrangère',
} satisfies Record<EnumKey<typeof Nationalite>, string>;
