/*
  Warnings:

  - Added the required column `planKey` to the `userTemplete` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planPrice` to the `userTemplete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userTemplete" ADD COLUMN     "planKey" TEXT NOT NULL,
ADD COLUMN     "planPrice" DOUBLE PRECISION NOT NULL;
