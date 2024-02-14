-- DropForeignKey
ALTER TABLE "UsersRelationships" DROP CONSTRAINT "UsersRelationships_firstId_fkey";

-- AlterTable
ALTER TABLE "UsersRelationships" ALTER COLUMN "firstId" SET DATA TYPE TEXT,
ALTER COLUMN "secondId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "UsersRelationships" ADD CONSTRAINT "UsersRelationships_firstId_fkey" FOREIGN KEY ("firstId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
