import type { EnumKey } from '#utils/enum_utils';

export const TypeLicence = {
	COMPETITION: 'T',
	LOISIR: 'P',
	EVENEMENTIELLE: 'E',
	DIRIGEANT: 'A',
	DECOUVERTE: 'I',
	LIBERTE: 'L',
	AUTRE: '',
} as const;

export type TypeLicence = (typeof TypeLicence)[keyof typeof TypeLicence];

export const TypeLicenceDict = {
	COMPETITION: 'Compétition',
	LOISIR: 'Loisir',
	EVENEMENTIELLE: 'Événementielle',
	DIRIGEANT: 'Dirigeant',
	DECOUVERTE: 'Découverte',
	LIBERTE: 'Liberté',
	AUTRE: 'Autre',
} satisfies Record<EnumKey<typeof TypeLicence>, string>;
