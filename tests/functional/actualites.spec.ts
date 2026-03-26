import { describe, expect, it } from 'vitest';

import { Actualite } from '#models/divers/actualite';
import { instance } from '#tests/setup';

describe('[xml_new_actu]', () => {
	it('devrait récupérer les dernières actualités de la fédération', async () => {
		const response = await instance.actualites.fluxActualitesFederation();
		expect(response).toHaveLength(10);
		expect(response[0]).toBeInstanceOf(Actualite);
		expect(response[0]?.titre).toBe(
			'Bruille frappe fort, Roanne s’invite dans le top 4 : retour sur la J15 de la Pro A',
		);
		expect(response[0]?.date.isValid).toBe(true);
	});
});
