/*
  Warnings:

  - You are about to drop the `UsersInBanLists` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UsersInBanLists" DROP CONSTRAINT "UsersInBanLists_banListId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInBanLists" DROP CONSTRAINT "UsersInBanLists_userId_fkey";

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "banListId" VARCHAR(36);

-- DropTable
DROP TABLE "UsersInBanLists";

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_banListId_fkey" FOREIGN KEY ("banListId") REFERENCES "BanList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
