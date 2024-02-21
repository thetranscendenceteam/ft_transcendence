-- DropForeignKey
ALTER TABLE "UsersInBanLists" DROP CONSTRAINT "UsersInBanLists_chatId_fkey";

-- AddForeignKey
ALTER TABLE "UsersInBanLists" ADD CONSTRAINT "UsersInBanLists_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
