export function detaillerScores(
	scores: Array<number>,
): Array<[number, number]> {
	const scoresDetailles = [] as Array<[number, number]>;

	for (const score of scores) {
		if (score < 0 && score >= -9) {
			/** Si c'est une manche perdue aux avantages. */
			scoresDetailles.push([Math.abs(score), 11]);
		} else if (score < 0 && score < -9) {
			/** Si c'est une manche perdue avant les avantages. */
			scoresDetailles.push([Math.abs(score), Math.abs(score) + 2]);
		} else if (score >= 0 && score < 10) {
			/** Si c'est une manche gagnée avant les avantages. */
			scoresDetailles.push([11, Math.abs(score)]);
		} else {
			/** Si c'est une manche gagnée aux avantages. */
			scoresDetailles.push([Math.abs(score) + 2, Math.abs(score)]);
		}
	}

	return scoresDetailles;
}
