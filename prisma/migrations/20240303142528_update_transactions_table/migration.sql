/*
  Warnings:

  - You are about to drop the column `accountNumber` on the `wallets` table. All the data in the column will be lost.
  - You are about to alter the column `currency` on the `wallets` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `wallets` DROP COLUMN `accountNumber`,
    MODIFY `currency` ENUM('CAD', 'NIG', 'GBP', 'USD', 'EUR') NOT NULL,
    MODIFY `balance` DECIMAL(65, 30) NOT NULL DEFAULT 0.00;
