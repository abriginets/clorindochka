-- CreateTable
CREATE TABLE `TimeEvent` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `timeEventCategoryId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeEventChannel` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('title', 'timer') NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deletedAt` DATETIME(3) NULL,
    `timeEventId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TimeEventChannel_channelId_key`(`channelId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeEventCategory` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,

    UNIQUE INDEX `TimeEventCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TimeEvent` ADD CONSTRAINT `TimeEvent_timeEventCategoryId_fkey` FOREIGN KEY (`timeEventCategoryId`) REFERENCES `TimeEventCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeEventChannel` ADD CONSTRAINT `TimeEventChannel_timeEventId_fkey` FOREIGN KEY (`timeEventId`) REFERENCES `TimeEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
