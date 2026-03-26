import type { EnumKey } from '#utils/enum_utils';

export const Sexe = {
	HOMME: 'M',
	FEMME: 'F',
	AUTRE: '',
} as const;

export type Sexe = (typeof Sexe)[keyof typeof Sexe];

export const SexeDict = {
	HOMME: 'Homme',
	FEMME: 'Femme',
	AUTRE: 'Autre',
} satisfies Record<EnumKey<typeof Sexe>, string>;
