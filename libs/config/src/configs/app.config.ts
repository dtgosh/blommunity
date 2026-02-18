import { registerAs } from '@nestjs/config';
import { validatedEnv } from '../config.constants';

export default registerAs('app', () => ({
  env: validatedEnv.NODE_ENV,
  port: validatedEnv.PORT,
}));
