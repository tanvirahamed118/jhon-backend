/*
  Warnings:

  - Added the required column `userId` to the `userTemplete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "verify" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "userTemplete" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "userTemplete" ADD CONSTRAINT "userTemplete_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
