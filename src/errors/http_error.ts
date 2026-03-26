export class HttpError extends Error {
	constructor(message: string) {
		super(
			"Une erreur inattendue est survenue pendant l'appel aux serveurs de la FFTT.",
			{ cause: new Error(message) },
		);
	}
}
