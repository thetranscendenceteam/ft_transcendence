/*
  Warnings:

  - You are about to drop the column `status` on the `BanList` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `BanList` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BanList" DROP COLUMN "status",
DROP COLUMN "usersId";

-- CreateTable
CREATE TABLE "UsersInBanLists" (
    "userId" VARCHAR(36) NOT NULL,
    "banListId" VARCHAR(36) NOT NULL,
    "status" "UserChatStatus" NOT NULL,

    CONSTRAINT "UsersInBanLists_pkey" PRIMARY KEY ("userId","banListId")
);

-- AddForeignKey
ALTER TABLE "UsersInBanLists" ADD CONSTRAINT "UsersInBanLists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInBanLists" ADD CONSTRAINT "UsersInBanLists_banListId_fkey" FOREIGN KEY ("banListId") REFERENCES "BanList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
