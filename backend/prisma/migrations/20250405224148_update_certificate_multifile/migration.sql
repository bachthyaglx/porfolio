/*
  Warnings:

  - The `certificateFileUrl` column on the `Certificate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Certificate" DROP COLUMN "certificateFileUrl",
ADD COLUMN     "certificateFileUrl" TEXT[];
