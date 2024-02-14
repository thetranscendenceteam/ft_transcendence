/*
  Warnings:

  - You are about to drop the column `password` on the `Chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chats" DROP COLUMN "password",
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false;
