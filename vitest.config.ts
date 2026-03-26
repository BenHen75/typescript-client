import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	define: {
		'import.meta.vitest': 'undefined',
	},
	resolve: {
		alias: {
			'#contracts': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'./src/contracts',
			),
			'#core': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'./src/core',
			),
			'#enums': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'./src/enums',
			),
			'#errors': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'./src/errors',
			),
			'#models': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'./src/models',
			),
			'#services': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'./src/services',
			),
			'#utils': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'./src/utils',
			),
			'#tests': path.resolve(
				path.dirname(fileURLToPath(import.meta.url)),
				'./tests',
			),
			'#': path.resolve(path.dirname(fileURLToPath(import.meta.url)), './src'),
		},
	},
	test: {
		include: ['tests/**/*.spec.ts'],
	},
});
