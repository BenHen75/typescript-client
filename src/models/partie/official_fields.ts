import { FfttError } from '#errors/fftt_error';

/** Source observations stay distinct from reconciled or estimated games. */
export interface DonneesPartieOfficielle {
	idPartie: string | null;
	date: string | null;
	licence: string | null;
	licenceAdversaire: string | null;
	nomAdversaire: string | null;
	pointsAdversaire: number | null;
	codeChampionnat: string | null;
	epreuve: string | null;
	numeroJournee: number | null;
	coefficient: number | null;
	pointsObtenus: number | null;
	victoire: boolean | null;
	forfait: boolean | null;
}

export function sourceIdentifier(
	value: string | null | undefined,
): string | null {
	if (!value || /^0+$/.test(value)) return null;
	if (!/^\d{1,64}$/.test(value)) throw new FfttError('FFTT_INVALID_DATA');
	return value;
}

export function sourceVictory(
	value: string | null | undefined,
): boolean | null {
	if (!value) return null;
	if (value.toUpperCase() === 'V') return true;
	if (value.toUpperCase() === 'D') return false;
	throw new FfttError('FFTT_INVALID_DATA');
}

export function sourceForfeit(
	value: string | null | undefined,
): boolean | null {
	if (!value) return null;
	if (value === '1') return true;
	if (value === '0') return false;
	throw new FfttError('FFTT_INVALID_DATA');
}

export function sourceOpponentPoints(
	value: string | null | undefined,
): number | null {
	if (!value) return null;
	const plain = /^[+]?\d+(?:[.,]\d*)?$/.test(value);
	const numbered =
		/^N[°o]?\s*\d+\s+(?:[MF]\s+)?(\d+(?:[.,]\d+)?)\s*(?:pts?)?$/i.exec(value);
	const points = plain ? value : numbered?.[1];
	if (!points) return null;
	if (!/^[+]?\d+(?:[.,]\d{0,3})?$/.test(points))
		throw new FfttError('FFTT_INVALID_NUMBER');
	return Number(points.replace(',', '.'));
}
