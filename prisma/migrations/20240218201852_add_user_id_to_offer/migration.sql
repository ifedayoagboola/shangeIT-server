/*
  Warnings:

  - Added the required column `userId` to the `offers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `offers` ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `offers` ADD CONSTRAINT `offers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
