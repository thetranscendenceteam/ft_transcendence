/*
  Warnings:

  - A unique constraint covering the columns `[pseudo]` on the table `Users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Users_pseudo_key" ON "Users"("pseudo");
