import { ConfigModuleOptions } from '@nestjs/config';
import * as Joi from 'joi';
import { Env } from './config.enums';
import { ValidatedEnv } from './config.interfaces';
import appConfig from './configs/app.config';
import dbConfig from './configs/db.config';

const validationSchema = Joi.object<ValidatedEnv>({
  POSTGRES_USER: Joi.string().optional(),
  POSTGRES_PASSWORD: Joi.string().optional(),
  POSTGRES_DB: Joi.string().optional(),
  DB_HOST: Joi.string().optional(),
  DB_PORT: Joi.number().port().optional(),
  DB_SCHEMA: Joi.string().optional(),
  DATABASE_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string()
    .valid(...Object.values(Env))
    .required(),
  PORT: Joi.number().port().required(),
});

export const validatedEnv = Joi.attempt(
  process.env,
  validationSchema,
  'Environment validation failed',
  { allowUnknown: true, stripUnknown: true },
);

export const configModuleOptions: ConfigModuleOptions = {
  cache: true,
  isGlobal: true,
  ignoreEnvFile: validatedEnv.NODE_ENV !== Env.DEV,
  skipProcessEnv: true,
  validationSchema,
  validationOptions: { abortEarly: true },
  load: [appConfig, dbConfig],
  expandVariables: true,
};
