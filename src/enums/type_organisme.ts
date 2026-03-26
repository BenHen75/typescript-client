import type { EnumKey } from '#utils/enum_utils';

export const TypeOrganisme = {
	FEDERATION: 'F',
	ZONE: 'Z',
	LIGUE: 'L',
	COMITE: 'D',
} as const;

export type TypeOrganisme = (typeof TypeOrganisme)[keyof typeof TypeOrganisme];

export const TypeOrganismeDict = {
	FEDERATION: 'Fédération',
	ZONE: 'Zone',
	LIGUE: 'Ligue',
	COMITE: 'Comité',
} satisfies Record<EnumKey<typeof TypeOrganisme>, string>;
