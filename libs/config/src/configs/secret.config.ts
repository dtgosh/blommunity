import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { validationErrorMessage } from '../config.constants';
import { SecretConfig } from '../config.interfaces';

export default registerAs(
  'secret',
  (): SecretConfig =>
    Joi.attempt(
      process.env,
      Joi.object<SecretConfig>({
        DATABASE_URL: Joi.string().uri().required(),
        CACHE_URL: Joi.string().uri().required(),
        JWT_SECRET: Joi.string().min(32).required(),
      }),
      validationErrorMessage,
      { stripUnknown: true },
    ),
);
