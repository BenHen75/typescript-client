export function generateSerial(length = 15): string {
	const chars =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const randomValues = new Uint8Array(length);
	crypto.getRandomValues(randomValues);

	return [...randomValues].map((val) => chars[val % chars.length]).join('');
}
