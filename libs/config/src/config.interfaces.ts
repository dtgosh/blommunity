import { Env } from './config.enums';

export interface ValidatedEnv {
  NODE_ENV: Env;
  PORT: number;
  DATABASE_URL: string;
  CACHE_URL: string;
}
