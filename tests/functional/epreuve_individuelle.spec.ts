import { assert, describe, it } from 'vitest';

import { Classement } from '#models/epreuve/individuelle/classement';
import { Groupe } from '#models/epreuve/individuelle/groupe';
import { Partie } from '#models/epreuve/individuelle/partie';
import { instance } from '#tests/setup';

describe('[xml_result_indiv]', () => {
	it("devrait récupérer les groupes d'une division", async () => {
		const response = await instance.epreuveIndividuelle.rechercherGroupes(
			123,
			456,
		);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Groupe);
		assert.strictEqual(response[0].libelle, 'T4 Gr1');
	});

	it("devrait récupérer les parties d'une division", async () => {
		const response = await instance.epreuveIndividuelle.recupererParties(
			123,
			456,
		);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Partie);
		assert.strictEqual(response[0].libelle, 'Finale');
	});

	it("devrait récupérer le classement d'une division", async () => {
		const response = await instance.epreuveIndividuelle.recupererClassement(
			123,
			456,
		);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Classement);
		assert.strictEqual(response[0].pointsCriterium, '150A');
	});

	it('devrait retourner un tableau vide si division non trouvée pour classement', async () => {
		const response = await instance.epreuveIndividuelle.recupererClassement(
			999999,
			999999,
			999999,
		);

		assert.isArray(response);
		assert.isEmpty(response);
	});
});

describe('[xml_res_cla]', () => {
	it("devrait récupérer le classement d'une division de CF nouvelle formule", async () => {
		const response =
			await instance.epreuveIndividuelle.recupererClassementCriterium(1);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Classement);
		assert.strictEqual(response[0].rang, 1);
	});

	it('devrait retourner un tableau vide si division non trouvée', async () => {
		const response =
			await instance.epreuveIndividuelle.recupererClassementCriterium(999999);

		assert.isArray(response);
		assert.isEmpty(response);
	});
});
