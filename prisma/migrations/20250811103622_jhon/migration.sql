/*
  Warnings:

  - Changed the type of `domain` on the `user` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "cardNumber" TEXT,
DROP COLUMN "domain",
ADD COLUMN     "domain" TEXT NOT NULL;

-- DropEnum
DROP TYPE "SelectDomain";
