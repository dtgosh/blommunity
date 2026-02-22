import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import * as Joi from 'joi';
import { Env } from './config.enums';
import { ValidatedEnv } from './config.interfaces';

const isRemoteEnv = [Env.PRD, Env.STG, Env.TST].includes(
  process.env.NODE_ENV as Env,
);

if (!isRemoteEnv) {
  expand(dotenv.config());
}

export const validatedEnv = Joi.attempt(
  process.env,
  Joi.object<ValidatedEnv>({
    NODE_ENV: Joi.string()
      .valid(...Object.values(Env))
      .required(),
    PORT: Joi.number().port().required(),
    DATABASE_URL: Joi.string().uri().required(),
    CACHE_URL: Joi.string().uri().required(),
  }),
  '환경 변수 유효성 검사 실패: ',
  { allowUnknown: true, stripUnknown: true },
);
