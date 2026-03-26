import { assert, describe, it } from 'vitest';

import { TypeEquipe } from '#enums/type_equipe';
import { Club } from '#models/club/club';
import { DetailClub } from '#models/club/detail_club';
import { Equipe } from '#models/club/equipe';
import { instance } from '#tests/setup';

describe('[xml_club_dep2]', () => {
	it('devrait récupérer des clubs par leur département', async () => {
		const response = await instance.club.clubsParDepartement('16');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Club);
		assert.strictEqual(response[0].numero, '10160237');
	});

	it('devrait retourner un tableau vide si mauvais département', async () => {
		const response = await instance.club.clubsParDepartement('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});
});

describe('[xml_club_b]', () => {
	it('devrait récupérer des clubs par code postal', async () => {
		const response = await instance.club.clubsParCodePostal('16120');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Club);
		assert.strictEqual(response[0].numero, '10330035');
	});

	it('devrait retourner un tableau vide si mauvais code postal', async () => {
		const response = await instance.club.clubsParCodePostal('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});

	it('devrait récupérer des clubs par ville', async () => {
		const response = await instance.club.clubsParVille('bordeaux');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Club);
		assert.strictEqual(response[0].numero, '08751412');
	});

	it('devrait récupérer des clubs par un nom', async () => {
		const response = await instance.club.clubsParNom('ping');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Club);
		assert.strictEqual(response[0].numero, '08751412');
	});
});

describe('[xml_club_detail]', () => {
	it('devrait récupérer des clubs par un numéro', async () => {
		const response = await instance.club.detailClub('1');

		assert.instanceOf(response, DetailClub);
		assert.strictEqual(response.numero, '10160085');
	});

	it('devrait retourner undefined si aucun club trouvé', async () => {
		const response = await instance.club.detailClub('999999');

		assert.isUndefined(response);
	});
});

describe('[xml_club_detail]', () => {
	it("devrait récupérer les équipes d'un club", async () => {
		const response = await instance.club.equipesClub('1', TypeEquipe.MASCULINE);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], Equipe);
		assert.strictEqual(response[0].id, 10998);
	});

	it('devrait retourner un tableau vide si aucun club trouvé', async () => {
		const response = await instance.club.equipesClub(
			'999999',
			TypeEquipe.MASCULINE,
		);

		assert.isArray(response);
		assert.isEmpty(response);
	});
});
