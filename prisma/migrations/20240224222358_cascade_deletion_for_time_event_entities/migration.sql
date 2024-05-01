-- DropForeignKey
ALTER TABLE `TimeEvent` DROP FOREIGN KEY `TimeEvent_timeEventCategoryId_fkey`;

-- DropForeignKey
ALTER TABLE `TimeEventChannel` DROP FOREIGN KEY `TimeEventChannel_timeEventId_fkey`;

-- AddForeignKey
ALTER TABLE `TimeEvent` ADD CONSTRAINT `TimeEvent_timeEventCategoryId_fkey` FOREIGN KEY (`timeEventCategoryId`) REFERENCES `TimeEventCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeEventChannel` ADD CONSTRAINT `TimeEventChannel_timeEventId_fkey` FOREIGN KEY (`timeEventId`) REFERENCES `TimeEvent`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
