import { registerAs } from '@nestjs/config';
import { validatedEnv } from '../config.constants';

export default registerAs('app', () => ({ port: validatedEnv.PORT }));
