/*
  Warnings:

  - You are about to drop the column `customerId` on the `SalesTransaction` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SalesTransaction" DROP CONSTRAINT "SalesTransaction_customerId_fkey";

-- AlterTable
ALTER TABLE "SalesTransaction" DROP COLUMN "customerId",
ADD COLUMN     "customerType" TEXT,
ADD COLUMN     "invoiceId" TEXT,
ADD COLUMN     "payment" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION,
ADD COLUMN     "time" TEXT;

-- DropTable
DROP TABLE "Customer";
