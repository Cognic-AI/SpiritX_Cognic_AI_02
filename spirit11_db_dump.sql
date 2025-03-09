CREATE DATABASE  IF NOT EXISTS `spirit11` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `spirit11`;
-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: spirit11
-- ------------------------------------------------------
-- Server version	8.0.38

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Temporary view structure for view `admin_player_stats`
--

DROP TABLE IF EXISTS `admin_player_stats`;
/*!50001 DROP VIEW IF EXISTS `admin_player_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `admin_player_stats` AS SELECT 
 1 AS `player_id`,
 1 AS `name`,
 1 AS `university`,
 1 AS `category`,
 1 AS `total_runs`,
 1 AS `balls_faced`,
 1 AS `innings_played`,
 1 AS `wickets`,
 1 AS `overs_bowled`,
 1 AS `runs_conceded`,
 1 AS `batting_strike_rate`,
 1 AS `batting_average`,
 1 AS `bowling_strike_rate`,
 1 AS `economy_rate`,
 1 AS `player_points`,
 1 AS `player_value`,
 1 AS `last_updated`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `leaderboard`
--

DROP TABLE IF EXISTS `leaderboard`;
/*!50001 DROP VIEW IF EXISTS `leaderboard`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `leaderboard` AS SELECT 
 1 AS `username`,
 1 AS `display_name`,
 1 AS `total_points`,
 1 AS `is_complete`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `player_change_log`
--

DROP TABLE IF EXISTS `player_change_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `player_change_log` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `player_id` int NOT NULL,
  `change_type` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `change_timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `player_change_log_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `player_change_log`
--

LOCK TABLES `player_change_log` WRITE;
/*!40000 ALTER TABLE `player_change_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `player_change_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `player_statistics`
--

DROP TABLE IF EXISTS `player_statistics`;
/*!50001 DROP VIEW IF EXISTS `player_statistics`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `player_statistics` AS SELECT 
 1 AS `player_id`,
 1 AS `name`,
 1 AS `university`,
 1 AS `category`,
 1 AS `total_runs`,
 1 AS `balls_faced`,
 1 AS `innings_played`,
 1 AS `wickets`,
 1 AS `overs_bowled`,
 1 AS `runs_conceded`,
 1 AS `batting_strike_rate`,
 1 AS `batting_average`,
 1 AS `bowling_strike_rate`,
 1 AS `economy_rate`,
 1 AS `player_value`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `players`
--

DROP TABLE IF EXISTS `players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `players` (
  `player_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `university` varchar(100) NOT NULL,
  `category` varchar(50) NOT NULL,
  `total_runs` int NOT NULL,
  `balls_faced` int NOT NULL,
  `innings_played` int NOT NULL,
  `wickets` int NOT NULL,
  `overs_bowled` decimal(6,2) NOT NULL,
  `runs_conceded` int NOT NULL,
  `last_updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `batting_strike_rate` decimal(10,2) GENERATED ALWAYS AS ((case when (`balls_faced` > 0) then ((`total_runs` / `balls_faced`) * 100) else NULL end)) STORED,
  `batting_average` decimal(10,2) GENERATED ALWAYS AS ((case when (`innings_played` > 0) then (`total_runs` / `innings_played`) else NULL end)) STORED,
  `bowling_strike_rate` decimal(10,2) GENERATED ALWAYS AS ((case when (`wickets` > 0) then ((`overs_bowled` * 6) / `wickets`) else NULL end)) STORED,
  `economy_rate` decimal(10,2) GENERATED ALWAYS AS ((case when (`overs_bowled` > 0) then (`runs_conceded` / `overs_bowled`) else NULL end)) STORED,
  `player_points` decimal(10,2) GENERATED ALWAYS AS (((((case when (`balls_faced` > 0) then (((`total_runs` / `balls_faced`) * 100) / 5) else 0 end) + (case when (`innings_played` > 0) then ((`total_runs` / `innings_played`) * 0.8) else 0 end)) + (case when (`wickets` > 0) then (500 / ((`overs_bowled` * 6) / `wickets`)) else 0 end)) + (case when (`overs_bowled` > 0) then (140 / (`runs_conceded` / `overs_bowled`)) else 0 end))) STORED,
  `player_value` decimal(12,2) GENERATED ALWAYS AS ((round(((((9 * ((((case when (`balls_faced` > 0) then (((`total_runs` / `balls_faced`) * 100) / 5) else 0 end) + (case when (`innings_played` > 0) then ((`total_runs` / `innings_played`) * 0.8) else 0 end)) + (case when (`wickets` > 0) then (500 / ((`overs_bowled` * 6) / `wickets`)) else 0 end)) + (case when (`overs_bowled` > 0) then (140 / (`runs_conceded` / `overs_bowled`)) else 0 end))) + 100) * 1000) / 50000),0) * 50000)) STORED,
  PRIMARY KEY (`player_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `players`
--

LOCK TABLES `players` WRITE;
/*!40000 ALTER TABLE `players` DISABLE KEYS */;
INSERT INTO `players` (`player_id`, `name`, `university`, `category`, `total_runs`, `balls_faced`, `innings_played`, `wickets`, `overs_bowled`, `runs_conceded`, `last_updated`) VALUES (1,'Chamika Chandimal','University of the Visual & Performing Arts','Batsman',530,588,10,0,3.00,21,'2025-03-09 12:58:22'),(2,'Dimuth Dhananjaya','University of the Visual & Performing Arts','All-Rounder',250,208,10,8,40.00,240,'2025-03-09 12:58:22'),(3,'Avishka Mendis','Eastern University','All-Rounder',210,175,7,7,35.00,210,'2025-03-09 12:58:22'),(4,'Danushka Kumara','University of the Visual & Performing Arts','Batsman',780,866,15,0,5.00,35,'2025-03-09 12:58:22'),(5,'Praveen Vandersay','Eastern University','Batsman',329,365,7,0,3.00,24,'2025-03-09 12:58:22'),(6,'Niroshan Mathews','University of the Visual & Performing Arts','Batsman',275,305,5,0,2.00,18,'2025-03-09 12:58:22'),(7,'Chaturanga Gunathilaka','University of Moratuwa','Bowler',132,264,11,29,88.00,528,'2025-03-09 12:58:22'),(8,'Lahiru Rathnayake','University of Ruhuna','Batsman',742,824,14,0,1.00,8,'2025-03-09 12:58:22'),(9,'Jeewan Thirimanne','University of Jaffna','Batsman',780,866,15,0,3.00,24,'2025-03-09 12:58:22'),(10,'Kalana Samarawickrama','Eastern University','Batsman',728,808,14,0,4.00,32,'2025-03-09 12:58:22'),(11,'Lakshan Vandersay','University of the Visual & Performing Arts','All-Rounder',405,337,15,15,75.00,450,'2025-03-09 12:58:22'),(12,'Roshen Samarawickrama','University of Kelaniya','Bowler',140,280,14,46,140.00,560,'2025-03-09 12:58:22'),(13,'Sammu Sandakan','University of Ruhuna','Bowler',120,240,10,26,80.00,320,'2025-03-09 12:58:22'),(14,'Kalana Jayawardene','University of Jaffna','Bowler',120,240,10,33,100.00,400,'2025-03-09 12:58:22'),(15,'Binura Samarawickrama','University of the Visual & Performing Arts','Bowler',77,154,7,21,63.00,252,'2025-03-09 12:58:22'),(16,'Dasun Thirimanne','Eastern University','Bowler',121,242,11,29,88.00,440,'2025-03-09 12:58:22'),(17,'Angelo Samarawickrama','University of Kelaniya','Batsman',424,471,8,0,1.00,7,'2025-03-09 12:58:22'),(18,'Nuwan Jayawickrama','University of Ruhuna','Batsman',300,333,6,0,3.00,27,'2025-03-09 12:58:22'),(19,'Kusal Dhananjaya','South Eastern University','Batsman',480,533,10,0,2.00,16,'2025-03-09 12:58:22'),(20,'Chamika Bandara','Eastern University','Batsman',270,300,5,0,5.00,45,'2025-03-09 12:58:22'),(21,'Dilruwan Shanaka','University of Peradeniya','Batsman',384,426,8,0,5.00,45,'2025-03-09 12:58:22'),(22,'Danushka Jayawickrama','University of Peradeniya','All-Rounder',350,291,14,14,70.00,350,'2025-03-09 12:58:22'),(23,'Charith Shanaka','University of Colombo','Batsman',477,530,9,0,3.00,27,'2025-03-09 12:58:22'),(24,'Asela Nissanka','University of Sri Jayewardenepura','Batsman',765,850,15,0,0.00,1,'2025-03-09 12:58:22'),(25,'Wanindu Hasaranga','University of Colombo','Bowler',120,240,10,30,90.00,540,'2025-03-09 12:58:22'),(26,'Asela Vandersay','University of the Visual & Performing Arts','Bowler',154,308,14,37,112.00,448,'2025-03-09 12:58:22'),(27,'Pathum Fernando','University of Peradeniya','Batsman',450,500,10,0,2.00,18,'2025-03-09 12:58:22'),(28,'Angelo Kumara','Eastern University','Batsman',330,366,6,0,1.00,8,'2025-03-09 12:58:22'),(29,'Danushka Rajapaksa','University of Peradeniya','Batsman',441,490,9,0,5.00,35,'2025-03-09 12:58:22'),(30,'Suranga Shanaka','South Eastern University','Bowler',55,110,5,13,40.00,160,'2025-03-09 12:58:22'),(31,'Pathum Dhananjaya','Eastern University','Batsman',360,400,8,0,1.00,9,'2025-03-09 12:58:22'),(32,'Asela Asalanka','South Eastern University','Batsman',550,611,11,0,0.00,1,'2025-03-09 12:58:22'),(33,'Minod Rathnayake','University of Kelaniya','Bowler',154,308,14,37,112.00,448,'2025-03-09 12:58:22'),(34,'Binura Lakmal','University of Kelaniya','Batsman',540,600,12,0,2.00,16,'2025-03-09 12:58:22'),(35,'Praveen Asalanka','Eastern University','Batsman',477,530,9,0,1.00,7,'2025-03-09 12:58:22'),(36,'Angelo Jayawardene','University of Jaffna','Batsman',468,520,9,0,3.00,21,'2025-03-09 12:58:22'),(37,'Kamindu Asalanka','University of Moratuwa','Bowler',135,270,15,45,135.00,810,'2025-03-09 12:58:22'),(38,'Sadeera Rajapaksa','University of Jaffna','All-Rounder',275,229,11,8,44.00,264,'2025-03-09 12:58:22'),(39,'Sandakan Hasaranga','University of Kelaniya','Batsman',795,883,15,0,1.00,7,'2025-03-09 12:58:22'),(40,'Bhanuka Rajapaksa','University of Moratuwa','All-Rounder',364,303,14,11,56.00,336,'2025-03-09 12:58:22'),(41,'Chamika Rajapaksa','University of Ruhuna','Batsman',450,500,9,0,1.00,7,'2025-03-09 12:58:22'),(42,'Kamindu Lakmal','University of the Visual & Performing Arts','Batsman',780,866,15,0,5.00,35,'2025-03-09 12:58:22'),(43,'Lakshan Gunathilaka','University of Peradeniya','Bowler',84,168,7,21,63.00,315,'2025-03-09 12:58:22'),(44,'Tharindu Thirimanne','South Eastern University','Batsman',611,678,13,0,2.00,18,'2025-03-09 12:58:22'),(45,'Dinesh Samarawickrama','University of Jaffna','Batsman',400,444,8,0,3.00,27,'2025-03-09 12:58:22'),(46,'Suranga Sandakan','University of Moratuwa','Batsman',235,261,5,0,4.00,36,'2025-03-09 12:58:22'),(47,'Sandakan Dickwella','University of Jaffna','Batsman',368,408,8,0,3.00,27,'2025-03-09 12:58:22'),(48,'Sammu Rajapaksa','University of Ruhuna','Batsman',240,266,5,0,2.00,16,'2025-03-09 12:58:22'),(49,'Suranga Bandara','University of Moratuwa','Bowler',154,308,14,46,140.00,840,'2025-03-09 12:58:22'),(50,'Tharindu Embuldeniya','University of the Visual & Performing Arts','All-Rounder',264,220,12,12,60.00,360,'2025-03-09 12:58:22');
/*!40000 ALTER TABLE `players` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_player_update` AFTER UPDATE ON `players` FOR EACH ROW BEGIN
    INSERT INTO player_change_log (player_id, change_type)
    VALUES (NEW.player_id, 'UPDATE');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `team_players`
--

DROP TABLE IF EXISTS `team_players`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team_players` (
  `team_id` int NOT NULL,
  `player_id` int NOT NULL,
  `added_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`team_id`,`player_id`),
  KEY `player_id` (`player_id`),
  CONSTRAINT `team_players_ibfk_1` FOREIGN KEY (`team_id`) REFERENCES `teams` (`team_id`) ON DELETE CASCADE,
  CONSTRAINT `team_players_ibfk_2` FOREIGN KEY (`player_id`) REFERENCES `players` (`player_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team_players`
--

LOCK TABLES `team_players` WRITE;
/*!40000 ALTER TABLE `team_players` DISABLE KEYS */;
INSERT INTO `team_players` VALUES (1,4,'2025-03-09 12:58:22'),(1,9,'2025-03-09 12:58:22'),(1,11,'2025-03-09 12:58:22'),(1,13,'2025-03-09 12:58:22'),(1,22,'2025-03-09 12:58:22'),(1,23,'2025-03-09 12:58:22'),(1,31,'2025-03-09 12:58:22'),(1,33,'2025-03-09 12:58:22'),(1,38,'2025-03-09 12:58:22'),(1,43,'2025-03-09 12:58:22'),(1,49,'2025-03-09 12:58:22');
/*!40000 ALTER TABLE `team_players` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_player_add` AFTER INSERT ON `team_players` FOR EACH ROW BEGIN
    DECLARE player_points_val DECIMAL(10, 2);
    DECLARE player_value_val DECIMAL(12, 2);
    
    -- Get player points and value
    SELECT player_points, player_value INTO player_points_val, player_value_val
    FROM players WHERE player_id = NEW.player_id;
    
    -- Update team statistics
    UPDATE teams 
    SET 
        player_count = player_count + 1,
        total_points = total_points + player_points_val,
        total_value = total_value + player_value_val
    WHERE team_id = NEW.team_id;
    
    -- Update user budget
    UPDATE users u
    JOIN teams t ON u.username = t.username
    SET u.budget = u.budget - player_value_val
    WHERE t.team_id = NEW.team_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_player_remove` AFTER DELETE ON `team_players` FOR EACH ROW BEGIN
    DECLARE player_points_val DECIMAL(10, 2);
    DECLARE player_value_val DECIMAL(12, 2);
    
    -- Get player points and value
    SELECT player_points, player_value INTO player_points_val, player_value_val
    FROM players WHERE player_id = OLD.player_id;
    
    -- Update team statistics
    UPDATE teams 
    SET 
        player_count = player_count - 1,
        total_points = total_points - player_points_val,
        total_value = total_value - player_value_val
    WHERE team_id = OLD.team_id;
    
    -- Update user budget
    UPDATE users u
    JOIN teams t ON u.username = t.username
    SET u.budget = u.budget + player_value_val
    WHERE t.team_id = OLD.team_id;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `team_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `team_name` varchar(100) DEFAULT NULL,
  `is_complete` tinyint(1) GENERATED ALWAYS AS ((`player_count` = 11)) STORED,
  `player_count` int DEFAULT '0',
  `total_points` decimal(10,2) DEFAULT '0.00',
  `total_value` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`team_id`),
  KEY `username` (`username`),
  CONSTRAINT `teams_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teams`
--

LOCK TABLES `teams` WRITE;
/*!40000 ALTER TABLE `teams` DISABLE KEYS */;
INSERT INTO `teams` (`team_id`, `username`, `team_name`, `player_count`, `total_points`, `total_value`, `created_at`, `updated_at`) VALUES (1,'spiritx_2025','SpiritX Team',11,867.00,9000000.00,'2025-03-09 12:58:22','2025-03-09 12:58:22');
/*!40000 ALTER TABLE `teams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `tournament_summary`
--

DROP TABLE IF EXISTS `tournament_summary`;
/*!50001 DROP VIEW IF EXISTS `tournament_summary`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `tournament_summary` AS SELECT 
 1 AS `overall_runs`,
 1 AS `overall_wickets`,
 1 AS `highest_run_scorer`,
 1 AS `highest_runs`,
 1 AS `highest_wicket_taker`,
 1 AS `highest_wickets`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `user_player_stats`
--

DROP TABLE IF EXISTS `user_player_stats`;
/*!50001 DROP VIEW IF EXISTS `user_player_stats`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `user_player_stats` AS SELECT 
 1 AS `player_id`,
 1 AS `name`,
 1 AS `university`,
 1 AS `category`,
 1 AS `total_runs`,
 1 AS `balls_faced`,
 1 AS `innings_played`,
 1 AS `wickets`,
 1 AS `overs_bowled`,
 1 AS `runs_conceded`,
 1 AS `batting_strike_rate`,
 1 AS `batting_average`,
 1 AS `bowling_strike_rate`,
 1 AS `economy_rate`,
 1 AS `player_value`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `user_roles`
--

DROP TABLE IF EXISTS `user_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_roles` (
  `role_id` int NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `role_name` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_roles`
--

LOCK TABLES `user_roles` WRITE;
/*!40000 ALTER TABLE `user_roles` DISABLE KEYS */;
INSERT INTO `user_roles` VALUES (1,'admin'),(2,'user');
/*!40000 ALTER TABLE `user_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `display_name` varchar(100) DEFAULT NULL,
  `budget` decimal(12,2) DEFAULT '9000000.00',
  `role_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`username`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `user_roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('admin','$2b$10$APvR7wdanCWY9OObLBFN7.5CdzbXqm.Z93ao58wazsBOUkDjmGqG6','Administrator',9000000.00,1,'2025-03-09 12:57:32'),('spiritx_2025','$2b$10$VFeTZwJ0FrekM1qZOQgJPuijvRrVUwOPTz3tIvgvMuYSGAYjBhHFS','SpiritX',0.00,2,'2025-03-09 12:58:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'spirit11'
--

--
-- Dumping routines for database 'spirit11'
--
/*!50003 DROP PROCEDURE IF EXISTS `admin_create_player` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_create_player`(
    IN p_name VARCHAR(100),
    IN p_university VARCHAR(100),
    IN p_category VARCHAR(50),
    IN p_total_runs INT,
    IN p_balls_faced INT,
    IN p_innings_played INT,
    IN p_wickets INT,
    IN p_overs_bowled DECIMAL(6, 2),
    IN p_runs_conceded INT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_result = 'Error: Could not create player';
        ROLLBACK;
    END;
    
    START TRANSACTION;
    
    INSERT INTO players (
        name, university, category, total_runs, balls_faced,
        innings_played, wickets, overs_bowled, runs_conceded
    ) VALUES (
        p_name, p_university, p_category, p_total_runs, p_balls_faced,
        p_innings_played, p_wickets, p_overs_bowled, p_runs_conceded
    );
    
    SET p_result = CONCAT('Success: Player created with ID ', LAST_INSERT_ID());
    
    COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `admin_delete_player` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_delete_player`(
    IN p_player_id INT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE player_exists INT;
    DECLARE player_in_teams INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_result = 'Error: Could not delete player';
        ROLLBACK;
    END;
    
    SELECT COUNT(*) INTO player_exists FROM players WHERE player_id = p_player_id;
    
    IF player_exists = 0 THEN
        SET p_result = 'Error: Player not found';
    ELSE
        -- Check if player is in any teams
        SELECT COUNT(*) INTO player_in_teams FROM team_players WHERE player_id = p_player_id;
        
        IF player_in_teams > 0 THEN
            SET p_result = 'Error: Cannot delete player as they are in one or more teams';
        ELSE
            START TRANSACTION;
            
            DELETE FROM players WHERE player_id = p_player_id;
            
            SET p_result = CONCAT('Success: Player deleted with ID ', p_player_id);
            
            COMMIT;
        END IF;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `admin_update_player` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `admin_update_player`(
    IN p_player_id INT,
    IN p_name VARCHAR(100),
    IN p_university VARCHAR(100),
    IN p_category VARCHAR(50),
    IN p_total_runs INT,
    IN p_balls_faced INT,
    IN p_innings_played INT,
    IN p_wickets INT,
    IN p_overs_bowled DECIMAL(6, 2),
    IN p_runs_conceded INT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE player_exists INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_result = 'Error: Could not update player';
        ROLLBACK;
    END;
    
    SELECT COUNT(*) INTO player_exists FROM players WHERE player_id = p_player_id;
    
    IF player_exists = 0 THEN
        SET p_result = 'Error: Player not found';
    ELSE
        START TRANSACTION;
        
        UPDATE players SET
            name = p_name,
            university = p_university,
            category = p_category,
            total_runs = p_total_runs,
            balls_faced = p_balls_faced,
            innings_played = p_innings_played,
            wickets = p_wickets,
            overs_bowled = p_overs_bowled,
            runs_conceded = p_runs_conceded
        WHERE player_id = p_player_id;
        
        SET p_result = CONCAT('Success: Player updated with ID ', p_player_id);
        
        COMMIT;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_tournament_summary` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_tournament_summary`()
BEGIN
    SELECT * FROM tournament_summary;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `get_user_team_details` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `get_user_team_details`(IN p_username VARCHAR(50))
BEGIN
    -- Get team info
    SELECT 
        t.team_id, 
        t.team_name, 
        t.player_count,
        t.is_complete,
        CASE WHEN t.is_complete = 1 THEN t.total_points ELSE NULL END AS total_points,
        t.total_value,
        u.budget
    FROM 
        teams t
    JOIN 
        users u ON t.username = u.username
    WHERE 
        t.username = p_username;
    
    -- Get team players
    SELECT 
        p.player_id,
        p.name,
        p.university,
        p.category,
        p.player_value
    FROM 
        team_players tp
    JOIN 
        players p ON tp.player_id = p.player_id
    JOIN 
        teams t ON tp.team_id = t.team_id
    WHERE 
        t.username = p_username;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `user_add_player_to_team` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_add_player_to_team`(
    IN p_username VARCHAR(50),
    IN p_player_id INT,
    OUT p_result VARCHAR(100)
)
proc_label: BEGIN
    DECLARE user_budget DECIMAL(12, 2);
    DECLARE player_value_val DECIMAL(12, 2);
    DECLARE player_in_team INT;
    DECLARE team_id_val INT;
    DECLARE team_player_count INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_result = 'Error: Could not add player to team';
        ROLLBACK;
    END;
    
    -- Get user's team
    SELECT t.team_id, t.player_count INTO team_id_val, team_player_count
    FROM teams t
    WHERE t.username = p_username;
    
    -- Create team if it doesn't exist
    IF team_id_val IS NULL THEN
        INSERT INTO teams (username, team_name) VALUES (p_username, CONCAT(p_username, '''s Team'));
        SET team_id_val = LAST_INSERT_ID();
        SET team_player_count = 0;
    END IF;
    
    -- Check if team is already full
    IF team_player_count >= 11 THEN
        SET p_result = 'Error: Team is already full (11 players)';
        LEAVE proc_label;
    END IF;
    
    -- Get user budget
    SELECT budget INTO user_budget
    FROM users
    WHERE username = p_username;
    
    -- Get player value
    SELECT player_value INTO player_value_val
    FROM players
    WHERE player_id = p_player_id;
    
    -- Check if player is already in team
    SELECT COUNT(*) INTO player_in_team
    FROM team_players tp
    WHERE tp.team_id = team_id_val AND tp.player_id = p_player_id;
    
    -- Check if budget is sufficient and player not already in team
    IF player_in_team > 0 THEN
        SET p_result = 'Error: Player already in team';
    ELSEIF user_budget < player_value_val THEN
        SET p_result = 'Error: Insufficient budget';
    ELSE
        START TRANSACTION;
        
        -- Add player to team
        INSERT INTO team_players (team_id, player_id)
        VALUES (team_id_val, p_player_id);
        
        SET p_result = CONCAT('Success: Player added to team');
        
        COMMIT;
    END IF;
END proc_label ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `user_remove_player_from_team` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `user_remove_player_from_team`(
    IN p_username VARCHAR(50),
    IN p_player_id INT,
    OUT p_result VARCHAR(100)
)
BEGIN
    DECLARE team_id_val INT;
    DECLARE player_in_team INT;
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_result = 'Error: Could not remove player from team';
        ROLLBACK;
    END;
    
    -- Get user's team
    SELECT t.team_id INTO team_id_val
    FROM teams t
    WHERE t.username = p_username;
    
    -- Check if player is in team
    SELECT COUNT(*) INTO player_in_team
    FROM team_players tp
    WHERE tp.team_id = team_id_val AND tp.player_id = p_player_id;
    
    IF player_in_team = 0 THEN
        SET p_result = 'Error: Player not in team';
    ELSE
        START TRANSACTION;
        
        -- Remove player from team
        DELETE FROM team_players 
        WHERE team_id = team_id_val AND player_id = p_player_id;
        
        SET p_result = 'Success: Player removed from team';
        
        COMMIT;
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `admin_player_stats`
--

/*!50001 DROP VIEW IF EXISTS `admin_player_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `admin_player_stats` AS select `p`.`player_id` AS `player_id`,`p`.`name` AS `name`,`p`.`university` AS `university`,`p`.`category` AS `category`,`p`.`total_runs` AS `total_runs`,`p`.`balls_faced` AS `balls_faced`,`p`.`innings_played` AS `innings_played`,`p`.`wickets` AS `wickets`,`p`.`overs_bowled` AS `overs_bowled`,`p`.`runs_conceded` AS `runs_conceded`,`p`.`batting_strike_rate` AS `batting_strike_rate`,`p`.`batting_average` AS `batting_average`,(case when (`p`.`wickets` = 0) then 'Undefined' else cast(`p`.`bowling_strike_rate` as char charset utf8mb4) end) AS `bowling_strike_rate`,`p`.`economy_rate` AS `economy_rate`,`p`.`player_points` AS `player_points`,`p`.`player_value` AS `player_value`,`p`.`last_updated` AS `last_updated` from `players` `p` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `leaderboard`
--

/*!50001 DROP VIEW IF EXISTS `leaderboard`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `leaderboard` AS select `u`.`username` AS `username`,`u`.`display_name` AS `display_name`,`t`.`total_points` AS `total_points`,`t`.`is_complete` AS `is_complete` from (`users` `u` join `teams` `t` on((`u`.`username` = `t`.`username`))) where (`u`.`role_id` = 2) order by `t`.`total_points` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `player_statistics`
--

/*!50001 DROP VIEW IF EXISTS `player_statistics`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `player_statistics` AS select `p`.`player_id` AS `player_id`,`p`.`name` AS `name`,`p`.`university` AS `university`,`p`.`category` AS `category`,`p`.`total_runs` AS `total_runs`,`p`.`balls_faced` AS `balls_faced`,`p`.`innings_played` AS `innings_played`,`p`.`wickets` AS `wickets`,`p`.`overs_bowled` AS `overs_bowled`,`p`.`runs_conceded` AS `runs_conceded`,`p`.`batting_strike_rate` AS `batting_strike_rate`,`p`.`batting_average` AS `batting_average`,`p`.`bowling_strike_rate` AS `bowling_strike_rate`,`p`.`economy_rate` AS `economy_rate`,`p`.`player_value` AS `player_value` from `players` `p` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `tournament_summary`
--

/*!50001 DROP VIEW IF EXISTS `tournament_summary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `tournament_summary` AS select (select sum(`players`.`total_runs`) from `players`) AS `overall_runs`,(select sum(`players`.`wickets`) from `players`) AS `overall_wickets`,(select `players`.`name` from `players` where (`players`.`total_runs` = (select max(`players`.`total_runs`) from `players`))) AS `highest_run_scorer`,(select `players`.`total_runs` from `players` where (`players`.`total_runs` = (select max(`players`.`total_runs`) from `players`))) AS `highest_runs`,(select `players`.`name` from `players` where (`players`.`wickets` = (select max(`players`.`wickets`) from `players`))) AS `highest_wicket_taker`,(select `players`.`wickets` from `players` where (`players`.`wickets` = (select max(`players`.`wickets`) from `players`))) AS `highest_wickets` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `user_player_stats`
--

/*!50001 DROP VIEW IF EXISTS `user_player_stats`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `user_player_stats` AS select `p`.`player_id` AS `player_id`,`p`.`name` AS `name`,`p`.`university` AS `university`,`p`.`category` AS `category`,`p`.`total_runs` AS `total_runs`,`p`.`balls_faced` AS `balls_faced`,`p`.`innings_played` AS `innings_played`,`p`.`wickets` AS `wickets`,`p`.`overs_bowled` AS `overs_bowled`,`p`.`runs_conceded` AS `runs_conceded`,`p`.`batting_strike_rate` AS `batting_strike_rate`,`p`.`batting_average` AS `batting_average`,(case when (`p`.`wickets` = 0) then 'Undefined' else cast(`p`.`bowling_strike_rate` as char charset utf8mb4) end) AS `bowling_strike_rate`,`p`.`economy_rate` AS `economy_rate`,`p`.`player_value` AS `player_value` from `players` `p` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-09 18:32:35
