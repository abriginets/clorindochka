/*
  Warnings:

  - Added the required column `guildId` to the `TimeEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `TimeEvent` ADD COLUMN `guildId` VARCHAR(191) NOT NULL;
