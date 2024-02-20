/*
  Warnings:

  - You are about to drop the column `balanceAfter` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `balanceBefore` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `fromCurrency` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `rate` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `toCurrency` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transactionStatus` on the `transactions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transactions` DROP COLUMN `balanceAfter`,
    DROP COLUMN `balanceBefore`,
    DROP COLUMN `fromCurrency`,
    DROP COLUMN `rate`,
    DROP COLUMN `toCurrency`,
    DROP COLUMN `transactionStatus`;
