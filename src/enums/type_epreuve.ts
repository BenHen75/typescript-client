import type { EnumKey } from '#utils/enum_utils';

export const TypeEpreuve = {
	CHAMPIONNAT_DE_FRANCE_PAR_EQUIPES: 'E',
	AUTRE_EPREUVE_PAR_EQUIPES: 'H',
	AUTRE_EPREUVE_INDIVIDUELLE: 'I',
	CRITERIUM_FEDERAL: 'C',
} as const;

export type TypeEpreuve = (typeof TypeEpreuve)[keyof typeof TypeEpreuve];

export const TypeEpreuveDict = {
	CHAMPIONNAT_DE_FRANCE_PAR_EQUIPES: 'Championnat de France par équipes',
	AUTRE_EPREUVE_PAR_EQUIPES: 'Autre épreuve par équipes',
	AUTRE_EPREUVE_INDIVIDUELLE: 'Autre épreuve individuelle',
	CRITERIUM_FEDERAL: 'Critérium fédéral',
} satisfies Record<EnumKey<typeof TypeEpreuve>, string>;
