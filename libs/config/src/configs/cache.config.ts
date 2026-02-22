import { registerAs } from '@nestjs/config';
import { validatedEnv } from '../config.constants';

export default registerAs('cache', () => ({ url: validatedEnv.CACHE_URL }));
