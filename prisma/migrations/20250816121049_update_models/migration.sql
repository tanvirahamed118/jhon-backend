/*
  Warnings:

  - Added the required column `templateId` to the `referralCustomer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "referralCustomer" ADD COLUMN     "templateId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "referralCustomer" ADD CONSTRAINT "referralCustomer_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "userTemplete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
