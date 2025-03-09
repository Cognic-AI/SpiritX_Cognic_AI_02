-- AlterTable
ALTER TABLE `users` ADD COLUMN `role_id` INTEGER NOT NULL DEFAULT 2;

-- CreateTable
CREATE TABLE `user_roles` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `user_roles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
