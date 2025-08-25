/*
  Warnings:

  - A unique constraint covering the columns `[templateId]` on the table `buttonSet` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "buttonSet_templateId_key" ON "buttonSet"("templateId");
