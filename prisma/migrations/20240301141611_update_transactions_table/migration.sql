/*
  Warnings:

  - You are about to alter the column `receiver` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `sender` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.

*/
-- AlterTable
ALTER TABLE `transactions` MODIFY `receiver` INTEGER NOT NULL,
    MODIFY `sender` INTEGER NOT NULL;
