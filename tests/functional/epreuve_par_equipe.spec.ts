import { assert, describe, it } from 'vitest';

import { EquipePoule } from '#models/epreuve/par_equipes/poule/equipe_poule';
import { Poule } from '#models/epreuve/par_equipes/poule/poule';
import { DetailRencontre } from '#models/epreuve/par_equipes/rencontre/detail_rencontre';
import { Rencontre } from '#models/epreuve/par_equipes/rencontre/rencontre';
import { instance } from '#tests/setup';

describe('[xml_result_equ]', () => {
	it("devrait récupérer les poules d'une division", async () => {
		const response = await instance.epreuveParEquipe.poulesPourDivision(123);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Poule);
		assert.strictEqual(response[0].libelle, 'Poule 1');
	});

	it("devrait récupérer les rencontres d'une poule", async () => {
		const response = await instance.epreuveParEquipe.rencontresPourPoule(
			123,
			456,
		);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Rencontre);
		assert.strictEqual(response[0].libelle, 'Poule 2 - tour n°1 du 13/09/2025');
	});

	it("devrait récupérer les équipes d'une poule dans l'ordre de départ", async () => {
		const response = await instance.epreuveParEquipe.ordrePoule(123, 456);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], EquipePoule);
		assert.strictEqual(response[0].idEquipe, 1590);
	});

	it("devrait récupérer le classement d'une poule", async () => {
		const response = await instance.epreuveParEquipe.classementPoule(123, 456);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], EquipePoule);
		assert.strictEqual(response[0].idEquipe, 1904);
	});
});

describe('[xml_chp_renc]', () => {
	it("devrait récupérer le détail d'une rencontre classique", async () => {
		const response = await instance.epreuveParEquipe.detailRencontre(123456);

		assert.instanceOf(response, DetailRencontre);
		assert.strictEqual(response.resultat.equipeA, 'Chateaubernard 3');
		assert.strictEqual(response.resultat.equipeB, 'Vars EP 1');
	});

	it("devrait récupérer le détail d'une rencontre avec des joueurs numérotés", async () => {
		const response = await instance.epreuveParEquipe.detailRencontre(987654);

		assert.instanceOf(response, DetailRencontre);
		assert.strictEqual(response.resultat.equipeA, 'ROMANS ASPTT 1');
		assert.strictEqual(response.resultat.equipeB, 'LA ROMAGNE SS 2');
	});

	it('devrait retourner undefined si aucune rencontre trouvée', async () => {
		const response = await instance.epreuveParEquipe.detailRencontre(999999);

		assert.isUndefined(response);
	});
});
