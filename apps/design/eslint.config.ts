import tseslint from 'typescript-eslint';
import libraryConfig from '@blommunity/eslint-config/library';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '.astro/**'] },
  ...libraryConfig,
);
