import tseslint from 'typescript-eslint';
import baseConfig from '@blommunity/eslint-config/base';

export default tseslint.config(
  // openapi-ts 가 생성하는 코드(src/generated/**)는 린트 대상에서 제외한다.
  // (이전 ignore 패턴 'src/api.generated.ts' 는 존재하지 않는 옛 경로였다)
  { ignores: ['node_modules/**', 'src/generated/**'] },
  ...baseConfig,
);
