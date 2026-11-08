# Fork utilisé par Ping

Ce dépôt maintient les corrections du client FFTT nécessaires à Ping, à partir du commit amont `e9464f7622c5c6ab26360b15ce9814090cd12fbd`. La version `2026.7.0-ping.1` conserve les services existants et ajoute des projections fiables des données reçues.

## Installation reproductible

Le paquet construit de chaque version est attaché à la release GitHub du fork. `ping-front` dépend de l'URL exacte de ce paquet ; son lockfile vérifie son intégrité. Les installations et images Docker ne dépendent donc pas du clone voisin ni d'un outil de compilation du SDK.

Pour préparer une version, utiliser Node 24.14 ou supérieur, puis :

```sh
pnpm install --frozen-lockfile
pnpm typecheck
pnpm lint
pnpm test:ci
pnpm run ci
pnpm pack
```

Le contenu publié comprend `dist`, les déclarations TypeScript et la licence MIT. Les identifiants FFTT et les captures de réponses réelles ne sont pas inclus.

## Transport et intégration

```ts
const client = FFTTApi.create(appId, appKey, serial, {
	beforeRequest: async () => reserveSharedQuota(),
	fetcher: fetch,
	timeoutMs: 20_000,
	maxResponseBytes: 2_000_000,
});
```

Le quatrième argument accepte toujours un constructeur de transport personnalisé. Les nouvelles options permettent d'utiliser directement le transport corrigé : signature renouvelée en heure de Paris, décodage UTF-8/Latin1, normalisation des collections singleton, timeout, taille maximale et erreurs codées sans contenu serveur. Les requêtes d'une instance sont sérialisées. Avec `stopAfterFailure: true`, une erreur arrête les requêtes suivantes de la session sans consommer de quota supplémentaire ; Ping active cette option pour chaque travail de synchronisation. Par défaut, un client réutilisé peut effectuer une nouvelle requête après une erreur. Le quota partagé reste responsable des délais après erreur HTTP 429.

Les modèles conservent les noms complets, identifiants textuels, zéros et différences entre champs omis et vides. Les projections `donneesPubliques` et `donneesOfficielles` permettent de mapper les données sans relire le XML. Les champs inconnus d'enums facultatifs ne bloquent plus une liste publique.

Les dates et scores absents restent absents. Les getters de dates de rencontres peuvent donc renvoyer `undefined` et ceux des groupes `null`. Les paramètres de détail non fournis sont facultatifs. Les forfaits individuels distinguent `false`, `true` et `null` (non renseigné). Les erreurs de données d'une partie officielle sont validées lors de l'accès à sa projection, permettant à l'application d'isoler les lignes invalides.

La méthode `historiquePartiesBaseClassementLegacy(licence, { enabled: true })` est une extension explicitement facultative. Son interface distante peut être absente ou interdite ; elle ne remplace pas l'historique SPID et ne garantit aucune disponibilité. Ping la garde désactivée par défaut.

Les quotas PostgreSQL, saisons, autorisations, rapprochements d'identité, dédoublonnage métier et écritures restent dans l'application.

## Tests

`pnpm test:ci` exécute les tests autonomes sous `tests/unit`, avec réponses synthétiques et sans réseau. `pnpm typecheck` et `pnpm lint` couvrent les sources et ces tests. Les anciens tests fonctionnels amont restent accessibles par `pnpm test:functional` : ils nécessitent les fixtures `snapshots/mocks.json` et XML qui ne sont pas présentes dans le dépôt amont public. Ils ne sont pas présentés comme une validation exécutée de ce fork.
