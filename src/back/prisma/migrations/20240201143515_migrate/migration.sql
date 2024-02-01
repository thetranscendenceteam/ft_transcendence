/*
  Warnings:

  - You are about to drop the column `joinedat` on the `UsersInChats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "UsersInChats" DROP COLUMN "joinedat",
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
