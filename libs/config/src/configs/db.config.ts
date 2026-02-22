import { registerAs } from '@nestjs/config';
import { validatedEnv } from '../config.constants';

export default registerAs('db', () => ({ url: validatedEnv.DATABASE_URL }));
