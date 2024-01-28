-- CreateEnum
CREATE TYPE "RelationshipStatus" AS ENUM ('friends', 'pending_first_to_second', 'block_first_to_second', 'block_second_to_first', 'pending_second_to_first', 'unknown');

-- CreateEnum
CREATE TYPE "UserChatRole" AS ENUM ('owner', 'admin', 'member');

-- CreateEnum
CREATE TYPE "UserChatStatus" AS ENUM ('normal', 'muted', 'banned');

-- CreateTable
CREATE TABLE "Users" (
    "id" VARCHAR(36) NOT NULL,
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
    "id" VARCHAR(36) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInChats" (
    "userId" VARCHAR(36) NOT NULL,
    "chatId" VARCHAR(36) NOT NULL,
    "role" "UserChatRole" NOT NULL DEFAULT 'member',
    "status" "UserChatStatus" NOT NULL DEFAULT 'normal',
    "joinedat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersInChats_pkey" PRIMARY KEY ("userId","chatId")
);

-- CreateTable
CREATE TABLE "UsersRelationships" (
    "id" VARCHAR(36) NOT NULL,
    "firstId" INTEGER NOT NULL,
    "secondId" INTEGER NOT NULL,
    "status" "RelationshipStatus" NOT NULL DEFAULT 'unknown',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsersRelationships_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "UsersRelationships_id_key" ON "UsersRelationships"("id");

-- AddForeignKey
ALTER TABLE "UsersInChats" ADD CONSTRAINT "UsersInChats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInChats" ADD CONSTRAINT "UsersInChats_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersRelationships" ADD CONSTRAINT "UsersRelationships_firstId_fkey" FOREIGN KEY ("firstId") REFERENCES "Users"("ftId") ON DELETE RESTRICT ON UPDATE CASCADE;

