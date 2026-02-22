import { registerAs } from '@nestjs/config';
import { isDevEnv, validatedEnv } from '..';

export default registerAs('app', () => ({ isDevEnv, port: validatedEnv.PORT }));
