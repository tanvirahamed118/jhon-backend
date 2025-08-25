/*
  Warnings:

  - Changed the type of `expireIn` on the `otpModel` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "otpModel" DROP COLUMN "expireIn",
ADD COLUMN     "expireIn" TIMESTAMP(3) NOT NULL;
