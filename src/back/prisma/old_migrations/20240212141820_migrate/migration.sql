/*
  Warnings:

  - You are about to drop the column `banListId` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_banListId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "banListId";

-- CreateTable
CREATE TABLE "UsersInBanLists" (
    "userId" VARCHAR(36) NOT NULL,
    "banListId" VARCHAR(36) NOT NULL,

    CONSTRAINT "UsersInBanLists_pkey" PRIMARY KEY ("userId","banListId")
);

-- AddForeignKey
ALTER TABLE "UsersInBanLists" ADD CONSTRAINT "UsersInBanLists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInBanLists" ADD CONSTRAINT "UsersInBanLists_banListId_fkey" FOREIGN KEY ("banListId") REFERENCES "BanList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
