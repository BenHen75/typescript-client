import type { EnumKey } from '#utils/enum_utils';

export const TypeClub = {
	CORPORATIF: 'C',
	LIBRE: 'L',
	MIXTE: 'M',
	VIRTUEL: 'V',
	AUTRE: '',
} as const;

export type TypeClub = (typeof TypeClub)[keyof typeof TypeClub];

export const TypeClubDict = {
	CORPORATIF: 'Corporatif',
	LIBRE: 'Libre',
	MIXTE: 'Mixte',
	VIRTUEL: 'Virtuel',
	AUTRE: 'Autre',
} satisfies Record<EnumKey<typeof TypeClub>, string>;
