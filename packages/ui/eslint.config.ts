import tseslint from 'typescript-eslint';
import libraryConfig from '@blommunity/eslint-config/library';

export default tseslint.config(
  { ignores: ['node_modules/**'] },
  ...libraryConfig,
);
