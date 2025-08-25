/*
  Warnings:

  - The `accu` column on the `templateInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lat` column on the `templateInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `lon` column on the `templateInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "templateInfo" DROP COLUMN "accu",
ADD COLUMN     "accu" DOUBLE PRECISION,
DROP COLUMN "lat",
ADD COLUMN     "lat" DOUBLE PRECISION,
DROP COLUMN "lon",
ADD COLUMN     "lon" DOUBLE PRECISION;
