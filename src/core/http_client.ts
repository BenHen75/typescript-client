import type { HttpClientContract } from '#core/http_client_contract';
import type { ApiEndpoint } from '#enums/api_endpoints';

import {
	AbstractHttpClient,
	type RequestParams,
} from '#core/abstract_http_client';
import { signedUrl, requestFftt, type TransportOptions } from '#core/transport';
import { FfttError } from '#errors/fftt_error';
import { sourceCollection, sourceRecord } from '#utils/source_collection';

const collectionByEndpoint: Partial<Record<ApiEndpoint, string>> = {
	'/xml_equipe.php': 'equipe',
	'/xml_epreuve.php': 'epreuve',
	'/xml_division.php': 'division',
	'/xml_liste_joueur_o.php': 'joueur',
	'/xml_liste_joueur.php': 'joueur',
	'/xml_histo_classement.php': 'histo',
	'/xml_partie.php': 'partie',
	'/xml_partie_mysql.php': 'partie',
	'/xml_res_cla.php': 'classement',
	'/xml_new_actu.php': 'news',
	'/xml_club_dep2.php': 'club',
	'/xml_club_b.php': 'club',
};

export interface HttpClientOptions extends TransportOptions {
	/** Runs before every actual request, for external quotas or scheduling. */
	beforeRequest?: () => Promise<void>;
	fetcher?: typeof fetch;
	/** Abort the remaining requests of a short-lived sync session after failure. */
	stopAfterFailure?: boolean;
}

export class HttpClient
	extends AbstractHttpClient
	implements HttpClientContract
{
	readonly #options: HttpClientOptions;
	#tail: Promise<unknown> = Promise.resolve();
	#failure: Error | undefined;

	constructor(
		appId: string,
		appKey: string,
		serial: string,
		options: HttpClientOptions = {},
	) {
		super();
		this.appId = appId;
		this.appKey = appKey;
		this.serial = serial;
		this.#options = options;
	}

	fetch<Shape extends Record<string, unknown>>(
		endpoint: ApiEndpoint,
		params: RequestParams = {},
	): Promise<Shape> {
		const task = this.#tail.then(async () => {
			if (this.#failure) throw this.#failure;
			try {
				await this.#options.beforeRequest?.();
				const response = await requestFftt(
					signedUrl(endpoint, params, {
						appId: this.appId,
						appKey: this.appKey,
						serial: this.serial,
					}),
					this.#options.fetcher,
					this.#options,
				);
				return this.#normalize(endpoint, params, response) as Shape;
			} catch (error) {
				const failure =
					error instanceof Error ? error : new FfttError('FFTT_NETWORK_ERROR');
				if (this.#options.stopAfterFailure) this.#failure = failure;
				throw failure;
			}
		});
		this.#tail = task.then(
			() => null,
			() => null,
		);
		return task;
	}

	#normalize(
		endpoint: ApiEndpoint,
		params: RequestParams,
		response: Record<string, unknown>,
	): Record<string, unknown> {
		let collection = collectionByEndpoint[endpoint];
		if (endpoint === '/xml_licence_b.php' && params['club'])
			collection = 'licence';
		if (endpoint === '/xml_result_indiv.php') {
			collection =
				params['action'] === 'poule'
					? 'tour'
					: params['action'] === 'partie'
						? 'partie'
						: 'classement';
		}
		if (endpoint === '/xml_result_equ.php') {
			collection =
				params['action'] === 'poule'
					? 'poule'
					: params['action'] === 'initial' || params['action'] === 'classement'
						? 'classement'
						: 'tour';
		}
		if (collection && response['liste'] !== '')
			(response['liste'] as Record<string, unknown>)[collection] =
				sourceCollection(response, collection);
		if (endpoint === '/xml_chp_renc.php' && response['liste'] !== '') {
			sourceRecord(response, 'resultat');
			const list = response['liste'] as Record<string, unknown>;
			for (const key of ['joueur', 'partie'])
				list[key] = sourceCollection(response, key, { optional: true });
		}
		return response;
	}
}
