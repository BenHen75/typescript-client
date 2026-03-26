import { describe, expect, it } from 'vitest';

import { HttpError } from '#errors/http_error';
import { instance, badInstance } from '#tests/setup';

describe('[xml_initialisation]', () => {
	it("devrait s'authentifier avec les bons identifiants", async () => {
		const response = await instance.authentification.authentifier();
		expect(response).toBeTypeOf('boolean');
		expect(response).toBe(true);
	});

	it('devrait lever une exception avec les mauvais identifiants', async () => {
		await expect(() =>
			badInstance.authentification.authentifier(),
		).rejects.toThrow(HttpError);
	});
});
