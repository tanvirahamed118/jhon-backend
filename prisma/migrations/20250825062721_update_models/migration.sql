-- AlterTable
ALTER TABLE "userTemplete" ADD COLUMN     "songRequest" TEXT;

-- CreateTable
CREATE TABLE "templateInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templateInfo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "templateInfo" ADD CONSTRAINT "templateInfo_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "userTemplete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
