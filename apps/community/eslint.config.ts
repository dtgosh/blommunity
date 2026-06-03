import tseslint from 'typescript-eslint';
import nextConfig from '@blommunity/eslint-config/next';

export default tseslint.config(
  { ignores: ['.next/**', 'node_modules/**', 'next-env.d.ts'] },
  ...nextConfig,
);
