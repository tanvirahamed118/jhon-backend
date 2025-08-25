/*
  Warnings:

  - Changed the type of `name` on the `extraWisetbands` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "WisetbandName" AS ENUM ('BLACK', 'RED', 'GREEN', 'YELLOW', 'BLUE', 'WHITE', 'ORANGE');

-- AlterTable
ALTER TABLE "extraWisetbands" DROP COLUMN "name",
ADD COLUMN     "name" "WisetbandName" NOT NULL;

-- DropEnum
DROP TYPE "Wisetbands";
