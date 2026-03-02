-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_group_id_fkey";

-- AlterTable
ALTER TABLE "posts" ALTER COLUMN "group_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
