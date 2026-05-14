# Client TypeScript non-officiel de l'API FFTT 🏓

Ce client TypeScript permet d'interagir avec l'API de la Fédération Française de Tennis de Table (FFTT) pour récupérer des informations sur les joueurs, les clubs et les compétitions.

Ce projet est destiné aux développeurs qui souhaitent intégrer des fonctionnalités liées à la FFTT dans leurs applications JS/TS.

## Installation

```shell
npm add @fftt-api/typescript-client
```

## Utilisation

```ts
import { FFTTApi } from '@fftt-api/typescript-client';

const client = FFTTApi.create('<APP_ID>', '<APP_KEY>', '<SERIAL>');
const joueur = client.joueur.joueurParLicence('12345');
console.log(`Bonjour ${joueur.nom} ${joueur.prenom} !`);
```

## Identifiants

Les identifiants nécessaires pour utiliser ce client sont disponibles sur [le site de la FFTT](https://www.fftt.com/api/). Vous devez vous inscrire et obtenir une paire d'identifiants (APP_ID, APP_KEY) pour pouvoir utiliser ce client.

L'API demande également de fournir un numéro de série (SERIAL) unique qui sera affecté de façon permanente à chacun
des utilisateurs de cette librairie. Il prend la forme d'une chaîne de 15 caractères aléatoires contenant des chiffres et des lettres (`[a-z][A-Z][0-9]`).

Vous pouvez générer un numéro de série aléatoire en CLI avec la commande :

```shell
@fftt-api/typescript-client serial
```

Les identifiants sont sensibles et doivent être traités avec précaution. Il est recommandé de les stocker dans des variables d'environnement ou de fichiers de configuration sécurisés plutôt que de les écrire en dur dans le code source.

L'API de la FFTT est soumise à des conditions d'utilisation et de confidentialité. Veuillez consulter les termes et conditions de l'API pour plus d'informations.

## Méthodes disponibles

### Actualités (`client.actualites`)

- `fluxActualitesFederation` : récupère le flux RSS des actualités de la FFTT.

### Authentification (`client.authentification`)

- `authentifier` : authentifie l'utilisateur avec les identifiants fournis.

### Club (`client.club`)

- `clubsParDepartement` : récupère les clubs d'un département.
- `clubsParCodePostal` : récupère les clubs par code postal.
- `clubsParVille` : récupère les clubs par ville.
- `clubsParNom` : récupère les clubs par nom.
- `detailClub` : récupère les détails d'un club.
- `equipesClub` : récupère les équipes d'un club.

### Épreuve (`client.epreuve`)

- `rechercherEpreuves` : recherche les épreuves disponibles.
- `rechercherDivisionsPourEpreuve` : recherche les divisions pour une épreuve donnée.

### Épreuve individuelle (`client.epreuveIndividuelle`)

- `rechercherGroupes` : recherche les groupes pour une épreuve individuelle.
- `recupererParties` : récupère les parties d'une épreuve individuelle.
- `recupererClassement` : récupère le classement général d'une épreuve individuelle.
- `recupererClassementCriterium` : récupère le classement critérium d'une épreuve individuelle.

### Épreuve par équipe (`client.epreuveParEquipe`)

- `poulesPourDivision` : récupère les poules pour une division donnée.
- `rencontresPourPoule` : récupère les rencontres pour une poule donnée.
- `ordrePoule` : récupère l'ordre des rencontres pour une poule donnée.
- `classementPoule` : récupère le classement d'une poule donnée.
- `detailRencontre` : récupère les détails d'une rencontre donnée.

### Joueur (`client.joueur`)

- `joueursParNomSurBaseClassement` : récupère les joueurs par nom sur la base classement.
- `joueursParNomSurBaseSPID` : récupère les joueurs par nom sur la base SPID.
- `joueursParNom` : récupère les joueurs par nom.
- `joueursParClubSurBaseClassement` : récupère les joueurs par club sur la base classement.
- `joueursParClubSurBaseSPID` : récupère les joueurs par club sur la base SPID.
- `joueursParClub` : récupère les joueurs par club.
- `joueursParClubEtType` : récupère les joueurs par club et type.
- `joueurParLicenceSurBaseClassement` : récupère le joueur par licence sur la base classement.
- `joueurParLicenceSurBaseSPID` : récupère le joueur par licence sur la base SPID.
- `joueurParLicence` : récupère le joueur par licence.
- `historiquePartiesBaseSPID` : récupère l'historique des parties pour un joueur sur la base SPID.
- `historiqueClassementOfficiel` : récupère l'historique du classement officiel pour un joueur.

#### Méthodes supprimées (depuis 1.1.0)

Les méthodes suivantes ont été supprimées depuis la version 1.1.0 suite à la suppression des endpoints 
correspondants sur l'API de la Fédération :

- `historiquePartiesBaseClassement` : récupère l'historique des parties pour un joueur sur la base classement.
- `historiqueParties` : récupère l'historique des parties pour un joueur.
- `partiesValidees` : récupère les parties validées pour un joueur.
- `partiesNonValidees` : récupère les parties non validées pour un joueur.
- `pointsVirtuels` : récupère les points virtuels pour un joueur.
- `pointsVirtuelsSurPeriode` : récupère les points virtuels pour un joueur sur une période donnée.

### Organisme (`client.organisme`)

- `organismesParType` : récupère les organismes par type (Fédération, Zone, Ligue, Département).
- `organisme` : récupère les informations d'un organisme.
- `organismesEnfants` : récupère les organismes enfants d'un organisme.
