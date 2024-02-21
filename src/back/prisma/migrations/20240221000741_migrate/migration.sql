-- DropForeignKey
ALTER TABLE "MatchScore" DROP CONSTRAINT "MatchScore_matchId_fkey";

-- DropForeignKey
ALTER TABLE "UsersInMatchs" DROP CONSTRAINT "UsersInMatchs_matchId_fkey";

-- AddForeignKey
ALTER TABLE "UsersInMatchs" ADD CONSTRAINT "UsersInMatchs_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matchs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchScore" ADD CONSTRAINT "MatchScore_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Matchs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
