import { validatedEnv } from './libs/config/src/config.constants';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'libs/db/schema.prisma',
  migrations: { path: 'libs/db/migrations' },
  datasource: { url: validatedEnv.DATABASE_URL },
});
