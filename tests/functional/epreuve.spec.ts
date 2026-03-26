import { assert, describe, it } from 'vitest';

import { TypeEpreuve } from '#enums/type_epreuve';
import { Division } from '#models/epreuve/division';
import { Epreuve } from '#models/epreuve/epreuve';
import { instance } from '#tests/setup';

describe('[xml_epreuve]', () => {
	it('devrait récupérer la liste des épreuves', async () => {
		const response = await instance.epreuve.rechercherEpreuves(
			123,
			TypeEpreuve.AUTRE_EPREUVE_INDIVIDUELLE,
		);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Epreuve);
		assert.strictEqual(response[0].id, 256);
	});

	it('devrait retourner un tableau vide si aucun résultat', async () => {
		const response = await instance.epreuve.rechercherEpreuves(
			999999,
			TypeEpreuve.AUTRE_EPREUVE_INDIVIDUELLE,
		);

		assert.isArray(response);
		assert.isEmpty(response);
	});
});

describe('[xml_division]', () => {
	it("devrait récupérer les divisions d'une épreuve", async () => {
		const response = await instance.epreuve.rechercherDivisionsPourEpreuve(
			123,
			456,
			TypeEpreuve.AUTRE_EPREUVE_INDIVIDUELLE,
		);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Division);
		assert.strictEqual(response[0].id, 196680);
	});

	it('devrait retourner un tableau vide si aucun résultat', async () => {
		const response = await instance.epreuve.rechercherDivisionsPourEpreuve(
			123,
			999999,
			TypeEpreuve.AUTRE_EPREUVE_INDIVIDUELLE,
		);

		assert.isArray(response);
		assert.isEmpty(response);
	});
});
