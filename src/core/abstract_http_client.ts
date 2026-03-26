import { decodeXML } from 'entities';
import { XMLParser } from 'fast-xml-parser';

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
		const bytes =
			content instanceof ArrayBuffer ? new Uint8Array(content) : content;

		const header = new TextDecoder('latin1').decode(
			bytes.slice(0, Math.min(200, bytes.length)),
		);

		let text: string;
		if (/encoding=["']ISO-8859-1["']/i.test(header)) {
			try {
				text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
			} catch {
				text = new TextDecoder('iso-8859-1').decode(bytes);
			}
			text = text.replaceAll(/encoding=["']ISO-8859-1["']/gi, (match) =>
				match.replaceAll('ISO-8859-1', 'utf8'),
			);
		} else {
			text = new TextDecoder('utf-8').decode(bytes);
		}

		return decodeXML(text);
	}

	/** Transforme une réponse XML en objet. */
	// oxlint-disable-next-line typescript/no-explicit-any
	protected convertXmlToObject<Shape extends Record<string, any>>(
		content: string,
	) {
		const parser = new XMLParser({
			ignoreDeclaration: true,
			parseTagValue: false,
		});

		return parser.parse(content) as Shape;
	}
}
