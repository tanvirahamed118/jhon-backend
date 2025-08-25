/*
  Warnings:

  - You are about to drop the column `notice` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `contact` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `contact` table. All the data in the column will be lost.
  - Added the required column `message` to the `contact` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contact" DROP COLUMN "notice",
DROP COLUMN "phone",
DROP COLUMN "role",
DROP COLUMN "service",
DROP COLUMN "status",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "seen" BOOLEAN NOT NULL DEFAULT false;
