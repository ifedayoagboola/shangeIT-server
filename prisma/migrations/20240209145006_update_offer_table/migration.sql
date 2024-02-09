/*
  Warnings:

  - You are about to alter the column `fromCurrency` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.
  - You are about to alter the column `toCurrency` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.
  - You are about to alter the column `rate` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.
  - You are about to alter the column `amount` on the `offers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `offers` MODIFY `fromCurrency` DECIMAL(65, 30) NOT NULL,
    MODIFY `toCurrency` DECIMAL(65, 30) NOT NULL,
    MODIFY `rate` DECIMAL(65, 30) NOT NULL,
    MODIFY `amount` DECIMAL(65, 30) NOT NULL;
