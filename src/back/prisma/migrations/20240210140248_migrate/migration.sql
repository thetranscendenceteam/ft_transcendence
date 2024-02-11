/*
  Warnings:

  - Added the required column `bestOf` to the `MatchScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `difficulty` to the `Matchs` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchDifficulty" AS ENUM ('easy', 'normal', 'hard');

-- AlterTable
ALTER TABLE "MatchScore" ADD COLUMN     "bestOf" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Matchs" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "difficulty" "MatchDifficulty" NOT NULL,
ALTER COLUMN "startedAt" DROP NOT NULL,
ALTER COLUMN "startedAt" DROP DEFAULT;
