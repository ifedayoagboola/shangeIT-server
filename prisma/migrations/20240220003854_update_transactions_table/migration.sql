/*
  Warnings:

  - Added the required column `receiver` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sender` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `receiver` VARCHAR(191) NOT NULL,
    ADD COLUMN `reference` VARCHAR(191) NOT NULL,
    ADD COLUMN `sender` VARCHAR(191) NOT NULL,
    ADD COLUMN `status` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` VARCHAR(191) NOT NULL;
