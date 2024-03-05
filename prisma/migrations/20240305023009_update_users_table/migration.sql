/*
  Warnings:

  - You are about to drop the `accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `accounts` DROP FOREIGN KEY `accounts_userIsVerified_fkey`;

-- DropIndex
DROP INDEX `users_verificationStatus_key` ON `users`;

-- DropTable
DROP TABLE `accounts`;
