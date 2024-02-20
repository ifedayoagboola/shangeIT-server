/*
  Warnings:

  - A unique constraint covering the columns `[verificationStatus]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `wallets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL DEFAULT 0,
    `currency` ENUM('CAN', 'GBP', 'USD', 'NIG', 'EUR') NOT NULL DEFAULT 'NIG',
    `accountNumber` INTEGER NOT NULL,
    `balance` DECIMAL(65, 30) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL DEFAULT 0,
    `fromCurrency` VARCHAR(191) NOT NULL,
    `toCurrency` VARCHAR(191) NOT NULL,
    `rate` DECIMAL(65, 30) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `balanceBefore` DECIMAL(65, 30) NOT NULL,
    `balanceAfter` DECIMAL(65, 30) NOT NULL,
    `transactionStatus` ENUM('PENDING', 'SUCCESS', 'REJECTED', 'FAILED') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `accountBalance` DECIMAL(65, 30) NOT NULL,
    `accountNumber` INTEGER NOT NULL,
    `accountId` INTEGER NOT NULL,
    `pinNumber` VARCHAR(191) NOT NULL,
    `currency` VARCHAR(191) NOT NULL,
    `userIsVerified` ENUM('PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `accounts_accountNumber_key`(`accountNumber`),
    UNIQUE INDEX `accounts_accountId_key`(`accountId`),
    UNIQUE INDEX `accounts_pinNumber_key`(`pinNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `users_verificationStatus_key` ON `users`(`verificationStatus`);

-- AddForeignKey
ALTER TABLE `wallets` ADD CONSTRAINT `wallets_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userIsVerified_fkey` FOREIGN KEY (`userIsVerified`) REFERENCES `users`(`verificationStatus`) ON DELETE RESTRICT ON UPDATE CASCADE;
