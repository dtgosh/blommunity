import { ConfigModuleOptions } from '@nestjs/config';
import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import * as Joi from 'joi';
import { Env } from './config.enums';
import { ValidatedEnv } from './config.interfaces';
import appConfig from './configs/app.config';
import cacheConfig from './configs/cache.config';
import dbConfig from './configs/db.config';

expand(dotenv.config());

const validationSchema = Joi.object<ValidatedEnv>({
  POSTGRES_USER: Joi.string().optional(),
  POSTGRES_PASSWORD: Joi.string().optional(),
  POSTGRES_DB: Joi.string().optional(),
  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().port().optional(),
  DB_SCHEMA: Joi.string().optional(),
  NODE_ENV: Joi.string()
    .valid(...Object.values(Env))
    .required(),
  PORT: Joi.number().port().required(),
  DATABASE_URL: Joi.string().uri().required(),
  CACHE_URL: Joi.string().uri().required(),
});

export const validatedEnv = Joi.attempt(
  process.env,
  validationSchema,
  '환경 변수 유효성 검사 실패: ',
  { allowUnknown: true, stripUnknown: true },
);

export const isDevEnv = validatedEnv.NODE_ENV === Env.DEV;

export const configModuleOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  ignoreEnvFile: !isDevEnv,
  skipProcessEnv: !isDevEnv,
  validationSchema,
  validationOptions: { abortEarly: true },
  load: [appConfig, cacheConfig, dbConfig],
  expandVariables: isDevEnv,
};
