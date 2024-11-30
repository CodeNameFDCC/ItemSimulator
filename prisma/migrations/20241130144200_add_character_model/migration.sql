/*
  Warnings:

  - The primary key for the `Item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `inventoryId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Item` DROP FOREIGN KEY `Item_userId_fkey`;

-- AlterTable
ALTER TABLE `Item` DROP PRIMARY KEY,
    DROP COLUMN `description`,
    DROP COLUMN `name`,
    DROP COLUMN `userId`,
    ADD COLUMN `addAtkSpd` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `addDamage` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `addDefense` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `addHealth` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `chracterName` VARCHAR(191) NULL,
    ADD COLUMN `inventoryId` VARCHAR(191) NOT NULL,
    ADD COLUMN `isEquip` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `itemImage` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `userName` VARCHAR(191) NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `userPassword` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Account_userName_key`(`userName`),
    UNIQUE INDEX `Account_userEmail_key`(`userEmail`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Character` (
    `id` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `characterName` VARCHAR(191) NOT NULL,
    `characterImage` VARCHAR(191) NOT NULL,
    `damage` INTEGER NOT NULL DEFAULT 10,
    `health` INTEGER NOT NULL DEFAULT 100,
    `defense` INTEGER NOT NULL DEFAULT 1,
    `atkspd` DOUBLE NOT NULL DEFAULT 1,
    `accountId` VARCHAR(191) NOT NULL,
    `inventoryId` VARCHAR(191) NULL,

    UNIQUE INDEX `Character_characterName_key`(`characterName`),
    UNIQUE INDEX `Character_inventoryId_key`(`inventoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Inventory` (
    `id` VARCHAR(191) NOT NULL,
    `userName` VARCHAR(191) NOT NULL,
    `chracterName` VARCHAR(191) NOT NULL,
    `money` INTEGER NOT NULL DEFAULT 10000,
    `characterId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Inventory_characterId_key`(`characterId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Character` ADD CONSTRAINT `Character_accountId_fkey` FOREIGN KEY (`accountId`) REFERENCES `Account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Inventory` ADD CONSTRAINT `Inventory_characterId_fkey` FOREIGN KEY (`characterId`) REFERENCES `Character`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Item` ADD CONSTRAINT `Item_inventoryId_fkey` FOREIGN KEY (`inventoryId`) REFERENCES `Inventory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
