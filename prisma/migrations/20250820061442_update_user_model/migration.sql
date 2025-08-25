/*
  Warnings:

  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "Role" NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "landerName" DROP NOT NULL,
ALTER COLUMN "aggreement" DROP NOT NULL,
ALTER COLUMN "package" DROP NOT NULL,
ALTER COLUMN "frequency" DROP NOT NULL,
ALTER COLUMN "domain" DROP NOT NULL,
ALTER COLUMN "planId" DROP NOT NULL,
ALTER COLUMN "planKey" DROP NOT NULL,
ALTER COLUMN "planOldPrice" DROP NOT NULL,
ALTER COLUMN "planPrice" DROP NOT NULL;

-- DropTable
DROP TABLE "admin";
