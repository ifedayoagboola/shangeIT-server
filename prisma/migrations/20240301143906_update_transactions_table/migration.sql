-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `userId` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `walletBalance` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `wallets` ALTER COLUMN `userId` DROP DEFAULT;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
