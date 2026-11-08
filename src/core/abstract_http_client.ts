import { decodeFfttXml, parseFfttXml } from '#core/transport';

export type RequestParams = Record<
	string,
	string | number | boolean | undefined
>;

export abstract class AbstractHttpClient {
	/** Identifiant unique fourni par la FFTT. */
	protected appId!: string;

	/** Mot de passe unique fourni par la FFTT. */
	protected appKey!: string;

	/**
	 * Chaîne de caractères identifiant l'utilisateur de façon permanente.
	 * Elle doit respecter le format suivant : [A-Za-z0-9]{15}.
	 */
	protected serial!: string;

	protected time!: string;

	protected tmc!: string;

	/** URL de base sur laquelle les endpoints se greffent. */
	protected baseUrl = 'https://apiv2.fftt.com/mobile/pxml';

	protected sanitizeResponse(content: ArrayBuffer | Uint8Array): string {
		return decodeFfttXml(
			content instanceof ArrayBuffer ? new Uint8Array(content) : content,
		);
	}

	/** Transforme une réponse XML en objet. */
	// oxlint-disable-next-line typescript/no-explicit-any
	protected convertXmlToObject<Shape extends Record<string, any>>(
		content: string,
	) {
		return parseFfttXml(new TextEncoder().encode(content)) as Shape;
	}
}
