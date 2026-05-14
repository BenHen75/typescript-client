import { assert, describe, it } from 'vitest';

import { TypeLicence } from '#enums/type_licence';
import { DetailJoueur } from '#models/joueur/detail_joueur';
import { DetailJoueurBaseClassement } from '#models/joueur/detail_joueur_base_classement';
import { DetailJoueurBaseSPID } from '#models/joueur/detail_joueur_base_spid';
import { HistoriqueClassement } from '#models/joueur/historique_classement';
import { JoueurBaseClassement } from '#models/joueur/joueur_base_classement';
import { JoueurBaseSPID } from '#models/joueur/joueur_base_spid';
import { PartieBaseClassement } from '#models/partie/partie_base_classement';
import { instance } from '#tests/setup';

describe('[xml_liste_joueur]', () => {
	it('devrait rechercher des joueurs par leur nom (base classement)', async () => {
		const response = await instance.joueur.joueursParNomSurBaseClassement('');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], JoueurBaseClassement);
		assert.strictEqual(response[0].licence, '552494');
	});

	it('devrait retourner un tableau vide si aucun joueur trouvé par nom (base classement)', async () => {
		const response =
			await instance.joueur.joueursParNomSurBaseClassement('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});

	it('devrait rechercher des joueurs par leur club (base classement)', async () => {
		const response = await instance.joueur.joueursParClubSurBaseClassement('');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], JoueurBaseClassement);
		assert.strictEqual(response[0].licence, '167374');
	});

	it('devrait retourner un tableau vide si aucun joueur trouvé par club (base classement)', async () => {
		const response =
			await instance.joueur.joueursParClubSurBaseClassement('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});
});

describe('[xml_liste_joueur_o]', () => {
	it('devrait rechercher des joueurs par leur nom (base SPID)', async () => {
		const response = await instance.joueur.joueursParNomSurBaseSPID('');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], JoueurBaseSPID);
		assert.strictEqual(response[0].licence, '552494');
	});

	it('devrait retourner un tableau vide si aucun joueur trouvé par nom (base SPID)', async () => {
		const response = await instance.joueur.joueursParNomSurBaseSPID('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});

	it('devrait rechercher des joueurs par leur nom', async () => {
		const response = await instance.joueur.joueursParNom('');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], JoueurBaseSPID);
		assert.strictEqual(response[0].licence, '552494');
	});

	it('devrait retourner un tableau vide si aucun joueur trouvé par nom', async () => {
		const response = await instance.joueur.joueursParNom('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});

	it('devrait rechercher des joueurs par leur club (base SPID)', async () => {
		const response = await instance.joueur.joueursParClubSurBaseSPID('');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], JoueurBaseSPID);
		assert.strictEqual(response[0].licence, '167376');
	});

	it('devrait retourner un tableau vide si aucun joueur trouvé par club (base SPID)', async () => {
		const response = await instance.joueur.joueursParClubSurBaseSPID('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});
});

describe('[xml_licence_b]', () => {
	it('devrait rechercher des joueurs par leur club', async () => {
		const response = await instance.joueur.joueursParClub('');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], DetailJoueur);
		assert.strictEqual(response[0].licence, '167376');
	});

	it('devrait retourner un tableau vide si aucun joueur trouvé par club', async () => {
		const response = await instance.joueur.joueursParClub('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});

	it('devrait rechercher des joueurs par leur club et leur type de licence', async () => {
		const response = await instance.joueur.joueursParClubEtType('', [
			TypeLicence.COMPETITION,
		]);

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], DetailJoueur);
		assert.strictEqual(response[0].licence, '167376');
		assert.strictEqual(response[0].typeLicence?.code, TypeLicence.COMPETITION);
	});

	it('devrait retourner un tableau vide si aucun joueur trouvé par club et type de licence', async () => {
		const response = await instance.joueur.joueursParClubEtType('999999', [
			TypeLicence.COMPETITION,
		]);

		assert.isArray(response);
		assert.isEmpty(response);
	});

	it('devrait rechercher des joueurs par leur numéro de licence', async () => {
		const response = await instance.joueur.joueurParLicence('1');

		assert.instanceOf(response, DetailJoueur);
		assert.strictEqual(response.licence, '1616528');
	});

	it('devrait retourner undefined si aucun joueur trouvé par numéro de licence', async () => {
		const response = await instance.joueur.joueurParLicence('999999');

		assert.isUndefined(response);
	});
});

describe('[xml_joueur]', () => {
	it('devrait rechercher des joueurs par leur numéro de licence (base classement)', async () => {
		const response =
			await instance.joueur.joueurParLicenceSurBaseClassement('1');

		assert.instanceOf(response, DetailJoueurBaseClassement);
		assert.strictEqual(response.licence, '1610533');
	});

	it('devrait retourner undefined si aucun joueur trouvé par numéro de licence (base classement)', async () => {
		const response =
			await instance.joueur.joueurParLicenceSurBaseClassement('999999');

		assert.isUndefined(response);
	});
});

describe('[xml_licence]', () => {
	it('devrait rechercher des joueurs par leur numéro de licence (base SPID)', async () => {
		const response = await instance.joueur.joueurParLicenceSurBaseSPID('1');

		assert.instanceOf(response, DetailJoueurBaseSPID);
		assert.strictEqual(response.licence, '1610533');
	});

	it('devrait retourner undefined si aucun joueur trouvé par numéro de licence (base SPID)', async () => {
		const response =
			await instance.joueur.joueurParLicenceSurBaseSPID('999999');

		assert.isUndefined(response);
	});
});

describe('[xml_partie_mysql]', () => {
	it("devrait récupérer l'historique des parties d'un joueur (base classement)", async () => {
		const response = await instance.joueur.historiquePartiesBaseClassement('1');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], PartieBaseClassement);
		assert.strictEqual(response[0].licence, '1616638');
	});

	it("devrait retourner un tableau vide si aucun joueur trouvé pour l'historique des parties (base classement)", async () => {
		const response =
			await instance.joueur.historiquePartiesBaseClassement('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});
});

describe('[xml_histo_classement]', () => {
	it("devrait récupérer l'historique de classement d'un joueur", async () => {
		const response = await instance.joueur.historiqueClassementOfficiel('1');

		assert.isArray(response);
		assert.isNotEmpty(response);
		assert.instanceOf(response[0], HistoriqueClassement);
		assert.strictEqual(response[0].pointsOfficiels, 500);
	});

	it("devrait retourner un tableau vide si aucun joueur trouvé pour l'historique de classement", async () => {
		const response =
			await instance.joueur.historiqueClassementOfficiel('999999');

		assert.isArray(response);
		assert.isEmpty(response);
	});
});
