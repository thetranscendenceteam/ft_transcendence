/*
  Warnings:

  - You are about to drop the column `status` on the `UsersInChats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UsersInChats" DROP COLUMN "status";

-- CreateTable
CREATE TABLE "UsersInBanLists" (
    "userId" VARCHAR(36) NOT NULL,
    "chatId" VARCHAR(36) NOT NULL,
    "status" "UserChatStatus" NOT NULL,
    "lastChange" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersInBanLists_pkey" PRIMARY KEY ("userId","chatId")
);

-- AddForeignKey
ALTER TABLE "UsersInBanLists" ADD CONSTRAINT "UsersInBanLists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInBanLists" ADD CONSTRAINT "UsersInBanLists_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
