import { assert, describe, it } from 'vitest';

import { TypeOrganisme } from '#enums/type_organisme';
import { Organisme } from '#models/organisme/organisme';
import { instance } from '#tests/setup';

describe('[xml_organisme]', () => {
	it("devrait récupérer les organismes d'un type particulier", async () => {
		const response = await instance.organisme.organismesParType(
			TypeOrganisme.ZONE,
		);

		assert.isArray(response);
		assert.lengthOf(response, 7);
		assert.instanceOf(response[0], Organisme);
		assert.strictEqual(response[0].code, 'Z01');
	});

	it('devrait récupérer un organisme par son code', async () => {
		const response = await instance.organisme.organisme('D16');

		assert.instanceOf(response, Organisme);
		assert.strictEqual(response.id, 131);
	});

	it("devrait récupérer les enfants d'un organisme", async () => {
		const response = await instance.organisme.organismesEnfants('FEDE');

		assert.isArray(response);
		assert.lengthOf(response, 7);
		assert.instanceOf(response[0], Organisme);
		assert.strictEqual(response[0].code, 'Z01');
	});

	it('devrait retourner undefined si aucun organisme trouvé', async () => {
		const response = await instance.organisme.organisme('B');

		assert.isUndefined(response);
	});

	it("devrait retourner un tableau vide d'enfants si aucun organisme père trouvé", async () => {
		const response = await instance.organisme.organismesEnfants('B');

		assert.isArray(response);
		assert.isEmpty(response);
	});
});
