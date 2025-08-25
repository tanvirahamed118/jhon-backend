/*
  Warnings:

  - You are about to drop the column `serviceFive` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `serviceFour` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `serviceOne` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `serviceThree` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `serviceTow` on the `userTemplete` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "secureKey" TEXT;

-- AlterTable
ALTER TABLE "userTemplete" DROP COLUMN "serviceFive",
DROP COLUMN "serviceFour",
DROP COLUMN "serviceOne",
DROP COLUMN "serviceThree",
DROP COLUMN "serviceTow";

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "userTemplete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
