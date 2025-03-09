-- CreateTable
CREATE TABLE `users` (
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NULL,
    `budget` DOUBLE NOT NULL DEFAULT 9000000.00,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `players` (
    `player_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `university` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NOT NULL,
    `total_runs` INTEGER NOT NULL,
    `balls_faced` INTEGER NOT NULL,
    `innings_played` INTEGER NOT NULL,
    `wickets` INTEGER NOT NULL,
    `overs_bowled` DOUBLE NOT NULL,
    `runs_conceded` INTEGER NOT NULL,
    `batting_strike_rate` DOUBLE NULL,
    `batting_average` DOUBLE NULL,
    `bowling_balls` DOUBLE NULL,
    `bowling_strike_rate` DOUBLE NULL,
    `economy_rate` DOUBLE NULL,
    `player_points` DOUBLE NULL,
    `player_value` DOUBLE NULL,

    PRIMARY KEY (`player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teams` (
    `team_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `team_name` VARCHAR(191) NULL,
    `player_count` INTEGER NOT NULL DEFAULT 0,
    `total_points` DOUBLE NOT NULL DEFAULT 0,
    `total_value` DOUBLE NOT NULL DEFAULT 0,
    `is_complete` BOOLEAN NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`team_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_players` (
    `team_id` INTEGER NOT NULL,
    `player_id` INTEGER NOT NULL,
    `added_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`team_id`, `player_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teams` ADD CONSTRAINT `teams_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_players` ADD CONSTRAINT `team_players_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `teams`(`team_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `team_players` ADD CONSTRAINT `team_players_player_id_fkey` FOREIGN KEY (`player_id`) REFERENCES `players`(`player_id`) ON DELETE CASCADE ON UPDATE CASCADE;
