-- AlterTable
ALTER TABLE "Courrier" ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[];
