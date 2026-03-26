import type { Sexe } from '#enums/sexe';

interface ClassementJoueur {
	numero: number | undefined;
	sexe: Sexe | undefined;
	points: number | undefined;
}

export function parseClassementJoueur(classement: string): ClassementJoueur {
	if (/^\d+$/.test(classement)) {
		return {
			numero: undefined,
			points: Number.parseInt(classement),
			sexe: undefined,
		};
	}

	const regex = /^N°?\s*(?<numero>\d+)\D+(?<sexe>[MF])?\s*(?<points>\d+)/u;
	const match = regex.exec(classement);

	if (!match?.groups) {
		return { numero: undefined, sexe: undefined, points: undefined };
	}

	const { numero, sexe, points } = match.groups;
	return {
		numero: numero ? Number(numero) : undefined,
		sexe: sexe as Sexe | undefined,
		points: points ? Number(points) : undefined,
	};
}

export function separerNomPrenom(nomPrenom: string): [string, string] {
	const normalized = nomPrenom.replaceAll(/\s+/g, ' ').replaceAll(/-+/g, '-');

	const regex =
		/^(?<nom>[A-ZÀ-Ý]+(?:[\s'-]*[A-ZÀ-Ý]+)*)\s(?<prenom>[A-ZÀ-Ý][a-zà-ÿ]*(?:[\s'-]*[A-ZÀ-Ý][a-zà-ÿ]*)*)$/;
	const match = regex.exec(normalized);

	if (!match?.groups || !match.groups['nom'] || !match.groups['prenom']) {
		return ['', ''];
	}

	return [match.groups['nom'], match.groups['prenom']];
}

export function classementDepuisPoints(points: string) {
	const classement = points.includes('.')
		? Number.parseFloat(points).toFixed(0)
		: points;

	return Number(classement.slice(0, -2));
}
