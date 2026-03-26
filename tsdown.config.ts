import { defineConfig } from 'tsdown';

export default defineConfig({
	entry: 'src/**/*.ts',
	dts: true,
	format: 'esm',
	platform: 'neutral',
	outDir: 'dist',
	unbundle: true,
});
