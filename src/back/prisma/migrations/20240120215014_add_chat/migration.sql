/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "userchatrole" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "userchatstatus" AS ENUM ('normal', 'muted', 'banned');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "ftid" INTEGER NOT NULL,
    "pseudo" VARCHAR(255) NOT NULL,
    "mail" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "firstname" VARCHAR(255) NOT NULL,
    "lastname" VARCHAR(255) NOT NULL,
    "avatar" TEXT NOT NULL,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "createdat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chats" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usersinchats" (
    "userid" TEXT NOT NULL,
    "chatid" TEXT NOT NULL,
    "role" "userchatrole" NOT NULL DEFAULT 'member',
    "status" "userchatstatus" NOT NULL DEFAULT 'normal',
    "joinedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usersinchats_pkey" PRIMARY KEY ("userid","chatid")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_ftid_key" ON "users"("ftid");

-- CreateIndex
CREATE UNIQUE INDEX "users_mail_key" ON "users"("mail");

-- CreateIndex
CREATE UNIQUE INDEX "chats_id_key" ON "chats"("id");

-- CreateIndex
CREATE UNIQUE INDEX "chats_name_key" ON "chats"("name");

-- AddForeignKey
ALTER TABLE "usersinchats" ADD CONSTRAINT "usersinchats_userid_fkey" FOREIGN KEY ("userid") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usersinchats" ADD CONSTRAINT "usersinchats_chatid_fkey" FOREIGN KEY ("chatid") REFERENCES "chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
