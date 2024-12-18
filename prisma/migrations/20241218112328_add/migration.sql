-- CreateTable
CREATE TABLE "Dossier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dossier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CourrierToDossier" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CourrierToDossier_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CourrierToDossier_B_index" ON "_CourrierToDossier"("B");

-- AddForeignKey
ALTER TABLE "Dossier" ADD CONSTRAINT "Dossier_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Dossier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourrierToDossier" ADD CONSTRAINT "_CourrierToDossier_A_fkey" FOREIGN KEY ("A") REFERENCES "Courrier"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CourrierToDossier" ADD CONSTRAINT "_CourrierToDossier_B_fkey" FOREIGN KEY ("B") REFERENCES "Dossier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
