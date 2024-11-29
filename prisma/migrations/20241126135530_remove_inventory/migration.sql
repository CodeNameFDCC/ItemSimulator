/*
  Warnings:

  - You are about to drop the column `inventoryId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Inventory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_inventoryId_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_inventoryId_fkey`;

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `inventoryId`,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `inventoryId`;

-- DropTable
DROP TABLE `Inventory`;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
