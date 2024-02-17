-- DropForeignKey
ALTER TABLE "UsersInChats" DROP CONSTRAINT "UsersInChats_chatId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInChats" DROP CONSTRAINT "UsersInChats_userId_fkey";

-- AddForeignKey
ALTER TABLE "UsersInChats" ADD CONSTRAINT "UsersInChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInChats" ADD CONSTRAINT "UsersInChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
