/*
  Warnings:

  - You are about to drop the column `status` on the `UsersInChats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "banListId" VARCHAR(36);

-- AlterTable
ALTER TABLE "UsersInChats" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "BanList" (
    "id" VARCHAR(36) NOT NULL,
    "chatId" VARCHAR(36) NOT NULL,
    "lastChange" TIMESTAMP(3) NOT NULL,
    "status" "UserChatStatus" NOT NULL DEFAULT 'normal',

    CONSTRAINT "BanList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BanList_id_key" ON "BanList"("id");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_banListId_fkey" FOREIGN KEY ("banListId") REFERENCES "BanList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BanList" ADD CONSTRAINT "BanList_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
