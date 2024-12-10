/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `sexe` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `statut` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropIndex
DROP INDEX "User_phone_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "address",
DROP COLUMN "email",
DROP COLUMN "firstName",
DROP COLUMN "name",
DROP COLUMN "phone",
DROP COLUMN "role",
DROP COLUMN "sexe",
DROP COLUMN "statut",
ADD COLUMN     "isdeleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
