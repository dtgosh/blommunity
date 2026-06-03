import tseslint from 'typescript-eslint';
import baseConfig from '@blommunity/eslint-config/base';

export default tseslint.config(
  { ignores: ['node_modules/**', 'src/api.generated.ts'] },
  ...baseConfig,
);
