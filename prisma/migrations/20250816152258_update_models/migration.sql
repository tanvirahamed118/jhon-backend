/*
  Warnings:

  - You are about to drop the column `planKey` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `planOldPrice` on the `userTemplete` table. All the data in the column will be lost.
  - You are about to drop the column `planPrice` on the `userTemplete` table. All the data in the column will be lost.
  - The required column `planId` was added to the `user` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `planKey` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planOldPrice` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planPrice` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "planId" TEXT NOT NULL,
ADD COLUMN     "planKey" TEXT NOT NULL,
ADD COLUMN     "planOldPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "planPrice" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "userTemplete" DROP COLUMN "planKey",
DROP COLUMN "planOldPrice",
DROP COLUMN "planPrice";
