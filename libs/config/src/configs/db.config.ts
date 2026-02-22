import { registerAs } from '@nestjs/config';
import { validatedEnv } from '..';

export default registerAs('db', () => ({ url: validatedEnv.DATABASE_URL }));
