import dotenv from 'dotenv';
import { expand } from 'dotenv-expand';
import { defineConfig } from 'prisma/config';

expand(dotenv.config());

export default defineConfig({
  schema: 'libs/db/schema.prisma',
  migrations: { path: 'libs/db/migrations' },
  datasource: { url: process.env.DATABASE_URL },
});
