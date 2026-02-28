import { Env } from './config.enums';

export const validationErrorMessage = '환경 변수 유효성 검사 실패: ';

export const isRemoteEnv = [Env.Production, Env.Staging, Env.Testing].includes(
  process.env.NODE_ENV as Env,
);

export const defaultAppConfig = {
  env: Env.Development,
  port: 3000,
  name: 'BlommunityApi',
};
