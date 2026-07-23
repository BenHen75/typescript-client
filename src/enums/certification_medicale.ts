import type { EnumKey } from '#utils/enum_utils';

export const CertificationMedicale = {
	ATTESTATION_AUTO_QUESTIONNAIRE_MAJEUR: 'A',
	ATTESTATION_AUTO_QUESTIONNAIRE_MINEUR: 'U',
	SANS_PRATIQUE_SPORTIVE: 'N',
	STANDARD: 'C',
	QUADRUPLE: 'Q',
	PARCOURS_PREVENTION_SANTE: 'P',
	AUTRE: '',
} as const;

export type CertificationMedicale =
	(typeof CertificationMedicale)[keyof typeof CertificationMedicale];

export const CertificationMedicaleDict = {
	ATTESTATION_AUTO_QUESTIONNAIRE_MAJEUR: 'Attestation auto questionnaire major',
	ATTESTATION_AUTO_QUESTIONNAIRE_MINEUR: 'Attestation auto questionnaire minor',
	SANS_PRATIQUE_SPORTIVE: 'Sans pratique sportive',
	STANDARD: 'Standard',
	QUADRUPLE: 'Quadruple',
	PARCOURS_PREVENTION_SANTE: 'Parcours Prévention Santé (PPS)',
	AUTRE: 'Autre',
} satisfies Record<EnumKey<typeof CertificationMedicale>, string>;
