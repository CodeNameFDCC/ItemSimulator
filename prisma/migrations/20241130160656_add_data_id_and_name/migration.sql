-- AlterTable
ALTER TABLE `Inventory` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `characterId` VARCHAR(191) NULL,
    ADD COLUMN `itemName` VARCHAR(191) NULL,
    ADD COLUMN `userId` VARCHAR(191) NULL;