-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "ftId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Matchs" (
    "id" VARCHAR(36) NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Matchs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersInMatchs" (
    "userId" VARCHAR(36) NOT NULL,
    "matchId" VARCHAR(36) NOT NULL,
    "isWin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UsersInMatchs_pkey" PRIMARY KEY ("userId","matchId")
);

-- CreateTable
CREATE TABLE "MatchScore" (
    "id" VARCHAR(36) NOT NULL,
    "winnerScore" INTEGER NOT NULL DEFAULT 0,
    "looserScore" INTEGER NOT NULL DEFAULT 0,
    "matchId" VARCHAR(36) NOT NULL,

    CONSTRAINT "MatchScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Matchs_id_key" ON "Matchs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MatchScore_id_key" ON "MatchScore"("id");

-- CreateIndex
CREATE UNIQUE INDEX "MatchScore_matchId_key" ON "MatchScore"("matchId");

-- AddForeignKey
ALTER TABLE "UsersInMatchs" ADD CONSTRAINT "UsersInMatchs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersInMatchs" ADD CONSTRAINT "UsersInMatchs_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matchs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchScore" ADD CONSTRAINT "MatchScore_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matchs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
