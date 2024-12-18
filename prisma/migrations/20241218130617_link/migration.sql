/*
  Warnings:

  - You are about to drop the `_CourrierToDossier` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CourrierToDossier" DROP CONSTRAINT "_CourrierToDossier_A_fkey";

-- DropForeignKey
ALTER TABLE "_CourrierToDossier" DROP CONSTRAINT "_CourrierToDossier_B_fkey";

-- AlterTable
ALTER TABLE "Courrier" ADD COLUMN     "dossierId" INTEGER;

-- DropTable
DROP TABLE "_CourrierToDossier";

-- AddForeignKey
ALTER TABLE "Courrier" ADD CONSTRAINT "Courrier_dossierId_fkey" FOREIGN KEY ("dossierId") REFERENCES "Dossier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
