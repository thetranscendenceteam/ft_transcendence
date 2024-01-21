/*
  Warnings:

  - You are about to drop the `chats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usersinchats` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserChatRole" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "UserChatStatus" AS ENUM ('normal', 'muted', 'banned');

-- DropForeignKey
ALTER TABLE "usersinchats" DROP CONSTRAINT "usersinchats_chatid_fkey";

-- DropForeignKey
ALTER TABLE "usersinchats" DROP CONSTRAINT "usersinchats_userid_fkey";

-- DropTable
DROP TABLE "chats";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "usersinchats";

-- DropEnum
DROP TYPE "userchatrole";

-- DropEnum
DROP TYPE "userchatstatus";

-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "ftId" INTEGER NOT NULL,
    "pseudo" VARCHAR(255) NOT NULL,
    "mail" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "avatar" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chats" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInChats" (
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "role" "UserChatRole" NOT NULL DEFAULT 'member',
    "status" "UserChatStatus" NOT NULL DEFAULT 'normal',
    "joinedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersInChats_pkey" PRIMARY KEY ("userId","chatId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_id_key" ON "Users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Users_ftId_key" ON "Users"("ftId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_mail_key" ON "Users"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "Chats_id_key" ON "Chats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Chats_name_key" ON "Chats"("name");

-- AddForeignKey
ALTER TABLE "UsersInChats" ADD CONSTRAINT "UsersInChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInChats" ADD CONSTRAINT "UsersInChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
