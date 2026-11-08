/** A stable error code without upstream payloads or signed request URLs. */
export class FfttError extends Error {
	constructor(
		public readonly code: string,
		public readonly retryAfterSeconds?: number,
		public readonly httpStatus?: number,
	) {
		super(code);
		this.name = 'FfttError';
	}
}
