import { defineConfig } from 'prisma/config';
import { validatedEnv } from './libs/config/src';

export default defineConfig({
  schema: 'libs/db/schema.prisma',
  migrations: { path: 'libs/db/migrations' },
  datasource: { url: validatedEnv.DATABASE_URL },
});
