import type { EnumKey } from '#utils/enum_utils';

export const Diplome = {
	/** Diplômes d'arbitrage */
	ARBITRE_DE_CLUB: 'AC',
	ARBITRE_REGIONAL: 'AR',
	ARBITRE_REGIONAL_THEORIQUE: 'ART',
	ARBITRE_NATIONAL: 'AN',
	ARBITRE_NATIONAL_THEORIQUE: 'ANT',
	ARBITRE_INTERNATIONAL: 'AI',
	ARBITRE_INTERNATIONAL_THEORIQUE: 'AIT',

	/** Diplômes de juge-arbitrage */
	JUGE_ARBITRE_PAR_EQUIPES: 'JA1',
	JUGE_ARBITRE_CRITERIUM_FEDERAL: 'JA2',
	JUGE_ARBITRE_EPREUVES_REGIONALES: 'JA3',
	JUGE_ARBITRE_EPREUVES_NATIONALES: 'JAN',
	JUGE_ARBITRE_EPREUVES_INTERNATIONALES: 'JAI',

	/** Diplômes techniques */
	JEUNE_ANIMATEUR_FEDERAL: 'JAF',
	JEUNE_ENTRAINEUR: 'JE',
	ANIMATEUR_POLYVALENT_DE_CLUB: 'APC',
	ENTRAINEUR_DEPARTEMENTAL: 'ED',
	ENTRAINEUR_REGIONAL: 'ER',
	INITIATEUR_DE_CLUB: 'IC',
	ANIMATEUR_FEDERAL: 'AF',
	ENTRAINEUR_FEDERAL: 'EF',
	DEJEPS: 'DEJEPS',
	DESJEPS: 'DESJEPS',
	CQP: 'CQP',
	BPJEPS: 'BPJEPS',
	BREVET_ETAT_EDUCATEUR_SPORTIF_1: 'BEES1',
	BREVET_ETAT_EDUCATEUR_SPORTIF_2: 'BEES2',
	BREVET_ETAT_EDUCATEUR_SPORTIF_3: 'BEES3',
	PROFESSORAT_DE_SPORT: 'PS',
	ANIMATEUR_PING_SANTE_BIEN_ETRE_MODULE_A: 'EPS',
	MONITEUR_PING_SANTE_SUR_ORDONNANCE_MODULE_B: 'MPS',
	ANIMATEUR_PING_PARKINSON: 'APP',

	/** Autres diplômes */
	AGENT_DEVELOPPEMENT: 'AD',
	SANS_DIPLOME: 'SANS',
} as const;

export type Diplome = (typeof Diplome)[keyof typeof Diplome];

export const DiplomeDict = {
	ARBITRE_DE_CLUB: 'Arbitre de club',
	ARBITRE_REGIONAL: 'Arbitre régional',
	ARBITRE_REGIONAL_THEORIQUE: 'Arbitre régional théorique',
	ARBITRE_NATIONAL: 'Arbitre national',
	ARBITRE_NATIONAL_THEORIQUE: 'Arbitre national théorique',
	ARBITRE_INTERNATIONAL: 'Arbitre international',
	ARBITRE_INTERNATIONAL_THEORIQUE: 'Arbitre international théorique',

	JUGE_ARBITRE_PAR_EQUIPES: 'Juge-arbitre par équipes',
	JUGE_ARBITRE_CRITERIUM_FEDERAL: 'Juge-arbitre critérium fédéral',
	JUGE_ARBITRE_EPREUVES_REGIONALES: 'Juge-arbitre épreuves régionales',
	JUGE_ARBITRE_EPREUVES_NATIONALES: 'Juge-arbitre épreuves nationales',
	JUGE_ARBITRE_EPREUVES_INTERNATIONALES:
		'Juge-arbitre épreuves internationales',

	JEUNE_ANIMATEUR_FEDERAL: 'Jeune Animateur Fédéral',
	JEUNE_ENTRAINEUR: 'Jeune entraîneur',
	ANIMATEUR_POLYVALENT_DE_CLUB: 'Animateur polyvalent de club',
	ENTRAINEUR_DEPARTEMENTAL: 'Entraîneur départemental',
	ENTRAINEUR_REGIONAL: 'Entraîneur régional',
	INITIATEUR_DE_CLUB: 'Initiateur de club',
	ANIMATEUR_FEDERAL: 'Animateur fédéral',
	ENTRAINEUR_FEDERAL: 'Entraîneur fédéral',
	DEJEPS: 'DEJEPS',
	DESJEPS: 'DESJEPS',
	CQP: 'CQP',
	BPJEPS: 'BPJEPS',
	BREVET_ETAT_EDUCATEUR_SPORTIF_1: "Brevet d'État Éducateur Sportif (niveau 1)",
	BREVET_ETAT_EDUCATEUR_SPORTIF_2: "Brevet d'État Éducateur Sportif (niveau 2)",
	BREVET_ETAT_EDUCATEUR_SPORTIF_3: "Brevet d'État Éducateur Sportif (niveau 3)",
	PROFESSORAT_DE_SPORT: 'Professorat de sport',
	ANIMATEUR_PING_SANTE_BIEN_ETRE_MODULE_A: 'Animateur Ping Santé Bien-être (Module A)',
	MONITEUR_PING_SANTE_SUR_ORDONNANCE_MODULE_B: 'Moniteur Ping Santé sur Ordonnance (Module B)',
	ANIMATEUR_PING_PARKINSON: 'Animateur Ping Parkinson',

	AGENT_DEVELOPPEMENT: 'Agent de développement',
	SANS_DIPLOME: 'Sans diplôme',
} satisfies Record<EnumKey<typeof Diplome>, string>;
