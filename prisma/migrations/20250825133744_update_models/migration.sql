/*
  Warnings:

  - Added the required column `phone` to the `contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contact" ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "subject" TEXT NOT NULL;
