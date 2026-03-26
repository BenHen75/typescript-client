import type { EnumKey } from '#utils/enum_utils';

export const TypeEquipe = {
	MASCULINE: 'M',
	FEMININE: 'F',
	MIXTE: 'A',
	AUTRE: '',
} as const;

export type TypeEquipe = (typeof TypeEquipe)[keyof typeof TypeEquipe];

export const TypeEquipeDict = {
	MASCULINE: 'Masculine',
	FEMININE: 'Féminine',
	MIXTE: 'Mixte',
	AUTRE: 'Autre',
} satisfies Record<EnumKey<typeof TypeEquipe>, string>;
