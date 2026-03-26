import { multiply, subtract, smallerEq, largerEq } from 'mathjs';

/**
 * Barème des points gagnés/perdus en fonction de la différence de classement.
 */
const BAREME = [
	{ min: Number.NEGATIVE_INFINITY, max: -500, gain: 40, perte: 0 },
	{ min: -499, max: -400, gain: 28, perte: 0 },
	{ min: -399, max: -300, gain: 22, perte: -0.5 },
	{ min: -299, max: -200, gain: 17, perte: -1 },
	{ min: -199, max: -150, gain: 13, perte: -2 },
	{ min: -149, max: -100, gain: 10, perte: -3 },
	{ min: -99, max: -50, gain: 8, perte: -4 },
	{ min: -49, max: -25, gain: 7, perte: -4.5 },
	{ min: -24, max: 0, gain: 6, perte: -5 },
	{ min: 0, max: 24, gain: 6, perte: -5 },
	{ min: 25, max: 49, gain: 5.5, perte: -6 },
	{ min: 50, max: 99, gain: 5, perte: -7 },
	{ min: 100, max: 149, gain: 4, perte: -8 },
	{ min: 150, max: 199, gain: 3, perte: -10 },
	{ min: 200, max: 299, gain: 2, perte: -12.5 },
	{ min: 300, max: 399, gain: 1, perte: -16 },
	{ min: 400, max: 499, gain: 0.5, perte: -20 },
	{ min: 500, max: Number.POSITIVE_INFINITY, gain: 0, perte: -29 },
] as const;

export function estimerPoints(
	classementJoueurA: number,
	classementJoueurB: number,
	victoire: boolean,
	coefficient: number,
): number {
	const differenceClassement = subtract(classementJoueurA, classementJoueurB);

	for (const { min, max, gain, perte } of BAREME) {
		if (
			largerEq(differenceClassement, min) &&
			smallerEq(differenceClassement, max)
		) {
			return multiply(victoire ? gain : perte, coefficient);
		}
	}

	throw new Error('Classement inconnu');
}
