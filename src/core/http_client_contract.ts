import type { RequestParams } from '#core/abstract_http_client';
import type { ApiEndpoint } from '#enums/api_endpoints';

export interface HttpClientContract {
	/**
	 * Appelle un endpoint et le convertit en objet.
	 */
	// oxlint-disable-next-line typescript/no-explicit-any
	fetch<Shape extends Record<string, any>>(
		endpoint: ApiEndpoint,
		requestParams?: RequestParams,
	): Promise<Shape>;
}
