import type { Sexe } from '#enums/sexe';

interface ClassementJoueur {
	numero: number | undefined;
	sexe: Sexe | undefined;
	points: number | undefined;
}

export function parseClassementJoueur(classement: string): ClassementJoueur {
	const text = classement.trim();
	const numbered = /^N[°o]?\s*(\d+)/i.exec(text);
	const gender = /(?:^|\s)([MF])(?=\s|\d|$)/.exec(text)?.[1] as
		| Sexe
		| undefined;
	const points = numbered
		? /^N[°o]?\s*\d+\s+(?:[MF]\s*)?(\d+(?:[.,]\d+)?)\s*(?:pts?)?$/i.exec(
				text,
			)?.[1]
		: /^(?:[MF]\s*)?(\d+(?:[.,]\d+)?)\s*(?:pts?)?$/i.exec(text)?.[1];
	return {
		numero: numbered?.[1] ? Number(numbered[1]) : undefined,
		sexe: gender,
		points: points === undefined ? undefined : Number(points.replace(',', '.')),
	};
}

export function separerNomPrenom(nomPrenom: string): [string, string] {
	const normalized = nomPrenom
		.trim()
		.replaceAll(/\s+/g, ' ')
		.replaceAll(/-+/g, '-');
	// A surname alone (including several capitalized words) is not a first name.
	if (!/[a-zà-ÿ]/.test(normalized)) return [normalized, ''];

	const regex =
		/^(?<nom>[A-ZÀ-Ý]+(?:[\s'-]*[A-ZÀ-Ý]+)*)\s(?<prenom>[A-ZÀ-Ý][a-zà-ÿ]*(?:[\s'-]*[A-ZÀ-Ý][a-zà-ÿ]*)*)$/;
	const match = regex.exec(normalized);

	if (!match?.groups || !match.groups['nom'] || !match.groups['prenom']) {
		return [normalized, ''];
	}

	return [match.groups['nom'], match.groups['prenom']];
}

export function classementDepuisPoints(points: string) {
	const classement = points.includes('.')
		? Number.parseFloat(points).toFixed(0)
		: points;

	return Number(classement.slice(0, -2));
}
