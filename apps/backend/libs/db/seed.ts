import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaClient, Role } from './src';

const pool = new Pool({ connectionString: `${process.env.DATABASE_URL}` });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main(): Promise<void> {
  await prisma.admin.upsert({
    where: { email: `${process.env.SEED_ADMIN_EMAIL}` },
    update: {},
    create: {
      name: `${process.env.SEED_ADMIN_NAME}`,
      role: Role.OWNER,
      email: `${process.env.SEED_ADMIN_EMAIL}`,
      password: await bcrypt.hash(`${process.env.SEED_ADMIN_PASSWORD}`, 10),
    },
  });

  console.log('The seed command executed successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
