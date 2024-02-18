/*
  Warnings:

  - You are about to alter the column `firstId` on the `UsersRelationships` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.
  - You are about to alter the column `secondId` on the `UsersRelationships` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(36)`.

*/
-- DropForeignKey
ALTER TABLE "UsersRelationships" DROP CONSTRAINT "UsersRelationships_firstId_fkey";

-- AlterTable
ALTER TABLE "UsersRelationships" ALTER COLUMN "firstId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "secondId" SET DATA TYPE VARCHAR(36);

-- AddForeignKey
ALTER TABLE "UsersRelationships" ADD CONSTRAINT "UsersRelationships_firstId_fkey" FOREIGN KEY ("firstId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
