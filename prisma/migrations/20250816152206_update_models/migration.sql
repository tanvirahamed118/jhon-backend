/*
  Warnings:

  - Added the required column `planOldPrice` to the `userTemplete` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userTemplete" ADD COLUMN     "planOldPrice" DOUBLE PRECISION NOT NULL;
