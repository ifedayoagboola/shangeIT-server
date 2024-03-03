/*
  Warnings:

  - Made the column `walletBalance` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `walletBalance` DECIMAL(65, 30) NOT NULL DEFAULT 0;
