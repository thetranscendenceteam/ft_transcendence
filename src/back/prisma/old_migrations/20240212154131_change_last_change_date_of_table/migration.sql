/*
  Warnings:

  - You are about to drop the column `lastChange` on the `BanList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BanList" DROP COLUMN "lastChange";

-- AlterTable
ALTER TABLE "UsersInBanLists" ADD COLUMN     "lastChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
