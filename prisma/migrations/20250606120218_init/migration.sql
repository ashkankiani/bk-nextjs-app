-- CreateTable
CREATE TABLE `Reservations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `orderId` INTEGER NOT NULL,
    `paymentId` INTEGER NOT NULL,
    `transactionId` INTEGER NULL,
    `serviceId` INTEGER NOT NULL,
    `providerId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `dateTimeStartEpoch` BIGINT NOT NULL,
    `dateTimeEndEpoch` BIGINT NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `status` ENUM('REVIEW', 'COMPLETED', 'DONE', 'CANCELED', 'REJECTED') NOT NULL DEFAULT 'COMPLETED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Draft` (
    `createEpoch` BIGINT NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `providerId` INTEGER NOT NULL,
    `userId` INTEGER NULL,
    `dateTimeStartEpoch` BIGINT NOT NULL,
    `dateTimeEndEpoch` BIGINT NOT NULL,
    `date` VARCHAR(191) NOT NULL,
    `time` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`serviceId`, `providerId`, `date`, `time`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `trackingCode` VARCHAR(191) NOT NULL,
    `status` ENUM('REVIEW', 'COMPLETED', 'DONE', 'CANCELED', 'REJECTED') NOT NULL DEFAULT 'COMPLETED',
    `userId` INTEGER NOT NULL,
    `serviceId` INTEGER NOT NULL,
    `providerId` INTEGER NOT NULL,
    `paymentId` INTEGER NOT NULL,
    `discountId` INTEGER NULL,
    `price` INTEGER NOT NULL,
    `discountPrice` INTEGER NULL,
    `totalPrice` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentType` ENUM('OnlinePayment', 'CashPayment', 'CartByCart', 'CardReader', 'Free', 'UnknownPayment') NOT NULL,
    `userId` INTEGER NOT NULL,
    `transactionId` INTEGER NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName` ENUM('NONE', 'ZARINPAL', 'IDPAY', 'ZIBAL', 'AQAYEPARDAKHT') NOT NULL,
    `trackId` VARCHAR(191) NOT NULL,
    `amount` INTEGER NOT NULL,
    `cardNumber` VARCHAR(191) NOT NULL,
    `authority` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Services` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `periodTime` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `capacity` INTEGER NOT NULL,
    `startDate` VARCHAR(191) NULL,
    `endDate` VARCHAR(191) NULL,
    `gender` ENUM('NONE', 'MAN', 'WOMAN') NOT NULL DEFAULT 'NONE',
    `codPayment` BOOLEAN NOT NULL DEFAULT false,
    `onlinePayment` BOOLEAN NOT NULL DEFAULT false,
    `smsToAdminService` BOOLEAN NOT NULL DEFAULT false,
    `smsToAdminProvider` BOOLEAN NOT NULL DEFAULT false,
    `smsToUserService` BOOLEAN NOT NULL DEFAULT false,
    `emailToAdminService` BOOLEAN NOT NULL DEFAULT false,
    `emailToAdminProvider` BOOLEAN NOT NULL DEFAULT false,
    `emailToUserService` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `descriptionAfterPurchase` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Providers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `slotTime` INTEGER NOT NULL,
    `startDate` VARCHAR(191) NULL,
    `endDate` VARCHAR(191) NULL,
    `startTime` VARCHAR(191) NULL,
    `endTime` VARCHAR(191) NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `workHolidays` BOOLEAN NOT NULL DEFAULT false,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeSheets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `serviceId` INTEGER NOT NULL,
    `providerId` INTEGER NOT NULL,
    `dayName` VARCHAR(191) NOT NULL,
    `dayIndex` INTEGER NOT NULL,
    `startTime` VARCHAR(191) NOT NULL,
    `endTime` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Faqs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` TINYTEXT NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Holidays` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `title` TINYTEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `startDate` VARCHAR(191) NULL,
    `endDate` VARCHAR(191) NULL,
    `type` ENUM('CONSTANT', 'PERCENT') NOT NULL DEFAULT 'CONSTANT',
    `amount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Discounts_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `catalogId` INTEGER NOT NULL DEFAULT 1,
    `codeMeli` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `mobile` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `gender` ENUM('NONE', 'MAN', 'WOMAN') NOT NULL DEFAULT 'NONE',
    `locked` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_codeMeli_key`(`codeMeli`),
    UNIQUE INDEX `Users_mobile_key`(`mobile`),
    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Catalogs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `catalogId` INTEGER NOT NULL,
    `admin` BOOLEAN NOT NULL DEFAULT false,
    `viewDashboard` BOOLEAN NOT NULL DEFAULT false,
    `viewReservation` BOOLEAN NOT NULL DEFAULT false,
    `addReservation` BOOLEAN NOT NULL DEFAULT false,
    `editReservation` BOOLEAN NOT NULL DEFAULT false,
    `deleteReservation` BOOLEAN NOT NULL DEFAULT false,
    `viewDraft` BOOLEAN NOT NULL DEFAULT false,
    `deleteDraft` BOOLEAN NOT NULL DEFAULT false,
    `viewServices` BOOLEAN NOT NULL DEFAULT false,
    `addServices` BOOLEAN NOT NULL DEFAULT false,
    `editServices` BOOLEAN NOT NULL DEFAULT false,
    `deleteServices` BOOLEAN NOT NULL DEFAULT false,
    `viewProviders` BOOLEAN NOT NULL DEFAULT false,
    `addProviders` BOOLEAN NOT NULL DEFAULT false,
    `editProviders` BOOLEAN NOT NULL DEFAULT false,
    `deleteProviders` BOOLEAN NOT NULL DEFAULT false,
    `viewTimesheets` BOOLEAN NOT NULL DEFAULT false,
    `addTimesheets` BOOLEAN NOT NULL DEFAULT false,
    `deleteTimesheets` BOOLEAN NOT NULL DEFAULT false,
    `viewFinancial` BOOLEAN NOT NULL DEFAULT false,
    `viewHolidays` BOOLEAN NOT NULL DEFAULT false,
    `addHolidays` BOOLEAN NOT NULL DEFAULT false,
    `editHolidays` BOOLEAN NOT NULL DEFAULT false,
    `deleteHolidays` BOOLEAN NOT NULL DEFAULT false,
    `viewDiscounts` BOOLEAN NOT NULL DEFAULT false,
    `addDiscounts` BOOLEAN NOT NULL DEFAULT false,
    `editDiscounts` BOOLEAN NOT NULL DEFAULT false,
    `deleteDiscounts` BOOLEAN NOT NULL DEFAULT false,
    `viewUsers` BOOLEAN NOT NULL DEFAULT false,
    `addUsers` BOOLEAN NOT NULL DEFAULT false,
    `editUsers` BOOLEAN NOT NULL DEFAULT false,
    `deleteUsers` BOOLEAN NOT NULL DEFAULT false,
    `exportUsers` BOOLEAN NOT NULL DEFAULT false,
    `importUsers` BOOLEAN NOT NULL DEFAULT false,
    `viewFaqs` BOOLEAN NOT NULL DEFAULT false,
    `addFaqs` BOOLEAN NOT NULL DEFAULT false,
    `editFaqs` BOOLEAN NOT NULL DEFAULT false,
    `deleteFaqs` BOOLEAN NOT NULL DEFAULT false,
    `viewSettings` BOOLEAN NOT NULL DEFAULT false,
    `editSettings` BOOLEAN NOT NULL DEFAULT false,
    `viewConnections` BOOLEAN NOT NULL DEFAULT false,
    `editConnections` BOOLEAN NOT NULL DEFAULT false,
    `viewCatalogs` BOOLEAN NOT NULL DEFAULT false,
    `addCatalogs` BOOLEAN NOT NULL DEFAULT false,
    `editCatalogs` BOOLEAN NOT NULL DEFAULT false,
    `deleteCatalogs` BOOLEAN NOT NULL DEFAULT false,
    `getSms` BOOLEAN NOT NULL DEFAULT true,
    `getEmail` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Permissions_catalogId_key`(`catalogId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sessions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionToken` TEXT NOT NULL,
    `userId` INTEGER NOT NULL,
    `expires` BIGINT NOT NULL,

    UNIQUE INDEX `Sessions_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL DEFAULT '',
    `address` VARCHAR(191) NOT NULL DEFAULT '',
    `phone` VARCHAR(191) NOT NULL DEFAULT '',
    `theme` ENUM('THEME1', 'THEME2', 'THEME3') NOT NULL DEFAULT 'THEME1',
    `minReservationDate` INTEGER NOT NULL DEFAULT 0,
    `maxReservationDate` INTEGER NOT NULL DEFAULT 30,
    `minReservationTime` INTEGER NOT NULL DEFAULT 0,
    `cancellationDeadline` INTEGER NOT NULL DEFAULT 24,
    `maxReservationDaily` INTEGER NOT NULL DEFAULT 10,
    `maxReservationMonthly` INTEGER NOT NULL DEFAULT 0,
    `automaticConfirmation` BOOLEAN NOT NULL DEFAULT true,
    `cancellationReservationUser` BOOLEAN NOT NULL DEFAULT true,
    `smsCancellationReservation` ENUM('NONE', 'ADMIN', 'PROVIDER', 'USER', 'ADMIN_PROVIDER', 'ADMIN_USER', 'PROVIDER_USER', 'ADMIN_PROVIDER_USER') NOT NULL DEFAULT 'ADMIN_PROVIDER_USER',
    `emailCancellationReservation` ENUM('NONE', 'ADMIN', 'PROVIDER', 'USER', 'ADMIN_PROVIDER', 'ADMIN_USER', 'PROVIDER_USER', 'ADMIN_PROVIDER_USER') NOT NULL DEFAULT 'ADMIN_PROVIDER_USER',
    `groupReservation` BOOLEAN NOT NULL DEFAULT true,
    `emailStatus` ENUM('OPTIONAL', 'MANDATORY', 'DELETE') NOT NULL DEFAULT 'DELETE',
    `shiftWorkStatus` BOOLEAN NOT NULL DEFAULT false,
    `permissionSearchShiftWork` BOOLEAN NOT NULL DEFAULT true,
    `registerOTP` BOOLEAN NOT NULL DEFAULT false,
    `loginOTP` BOOLEAN NOT NULL DEFAULT false,
    `cart` BOOLEAN NOT NULL DEFAULT false,
    `minReservationLock` INTEGER NOT NULL DEFAULT 20,
    `guestReservation` BOOLEAN NOT NULL DEFAULT false,
    `footerCode` TEXT NULL,
    `code` VARCHAR(191) NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Connections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bankName1` ENUM('NONE', 'ZARINPAL', 'IDPAY', 'ZIBAL', 'AQAYEPARDAKHT') NOT NULL DEFAULT 'NONE',
    `merchantId1` VARCHAR(191) NULL,
    `bankName2` ENUM('NONE', 'ZARINPAL', 'IDPAY', 'ZIBAL', 'AQAYEPARDAKHT') NOT NULL DEFAULT 'NONE',
    `merchantId2` VARCHAR(191) NULL,
    `smsName` ENUM('NONE', 'IPPANEL', 'MELIPAYAMAK', 'KAVENEGAR', 'FARAZSMS', 'SMSIR') NOT NULL DEFAULT 'NONE',
    `smsURL` VARCHAR(191) NULL,
    `smsToken` VARCHAR(191) NULL,
    `smsUserName` VARCHAR(191) NULL,
    `smsPassword` VARCHAR(191) NULL,
    `smsFrom` VARCHAR(191) NULL,
    `smsCodePattern1` VARCHAR(191) NULL,
    `smsCodePattern2` VARCHAR(191) NULL,
    `smsCodePattern3` VARCHAR(191) NULL,
    `smsCodePattern4` VARCHAR(191) NULL,
    `smsCodePattern5` VARCHAR(191) NULL,
    `smsCodePattern6` VARCHAR(191) NULL,
    `smsCodePattern7` VARCHAR(191) NULL,
    `smsCodePattern8` VARCHAR(191) NULL,
    `smtpURL` VARCHAR(191) NULL,
    `smtpPort` INTEGER NULL,
    `smtpUserName` VARCHAR(191) NULL,
    `smtpPassword` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtpSms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mobile` VARCHAR(191) NOT NULL,
    `expires` BIGINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `OtpSms_mobile_key`(`mobile`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `Orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reservations` ADD CONSTRAINT `Reservations_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Draft` ADD CONSTRAINT `Draft_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Draft` ADD CONSTRAINT `Draft_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Draft` ADD CONSTRAINT `Draft_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Providers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `Payments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `Discounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payments` ADD CONSTRAINT `Payments_transactionId_fkey` FOREIGN KEY (`transactionId`) REFERENCES `Transaction`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Services` ADD CONSTRAINT `Services_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Providers` ADD CONSTRAINT `Providers_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Providers` ADD CONSTRAINT `Providers_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeSheets` ADD CONSTRAINT `TimeSheets_serviceId_fkey` FOREIGN KEY (`serviceId`) REFERENCES `Services`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TimeSheets` ADD CONSTRAINT `TimeSheets_providerId_fkey` FOREIGN KEY (`providerId`) REFERENCES `Providers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_catalogId_fkey` FOREIGN KEY (`catalogId`) REFERENCES `Catalogs`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Permissions` ADD CONSTRAINT `Permissions_catalogId_fkey` FOREIGN KEY (`catalogId`) REFERENCES `Catalogs`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
