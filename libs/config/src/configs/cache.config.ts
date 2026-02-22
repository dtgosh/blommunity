import { registerAs } from '@nestjs/config';
import { validatedEnv } from '..';

export default registerAs('cache', () => ({ url: validatedEnv.CACHE_URL }));
