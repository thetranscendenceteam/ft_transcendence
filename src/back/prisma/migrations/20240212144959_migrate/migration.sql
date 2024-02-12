/*
  Warnings:

  - You are about to drop the column `status` on the `UsersInChats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersInChats" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "BanList" (
    "id" VARCHAR(36) NOT NULL,
    "chatId" VARCHAR(36) NOT NULL,
    "lastChange" TIMESTAMP(3) NOT NULL,
    "status" "UserChatStatus" NOT NULL DEFAULT 'normal',
    "usersId" TEXT[],

    CONSTRAINT "BanList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BanList_id_key" ON "BanList"("id");

-- CreateIndex
CREATE UNIQUE INDEX "BanList_chatId_key" ON "BanList"("chatId");

-- AddForeignKey
ALTER TABLE "BanList" ADD CONSTRAINT "BanList_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
