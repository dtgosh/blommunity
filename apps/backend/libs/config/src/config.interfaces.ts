import { Env } from './config.enums';

export interface AppConfig {
  env: Env;
  port: number;
  name: string;
}

export interface SecretConfig {
  DATABASE_URL: string;
  CACHE_URL: string;
  JWT_SECRET: string;
}
