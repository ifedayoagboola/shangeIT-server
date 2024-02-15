/*
  Warnings:

  - You are about to drop the `kyc` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `kyc` DROP FOREIGN KEY `kyc_userId_fkey`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `dob` VARCHAR(191) NULL,
    ADD COLUMN `documentNumber` VARCHAR(191) NULL,
    ADD COLUMN `documentType` VARCHAR(191) NULL,
    ADD COLUMN `phone` INTEGER NULL,
    ADD COLUMN `verificationStatus` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE `kyc`;
