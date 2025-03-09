-- Create database
CREATE DATABASE spirit11;
USE spirit11;

-- Create a user_roles table for role-based authentication
CREATE TABLE user_roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE
);

-- Insert basic roles
INSERT INTO user_roles (role_name) VALUES ('admin'), ('user');

-- Users table with role-based authentication
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,  -- Should be hashed in actual implementation
    display_name VARCHAR(100),
    budget DECIMAL(12, 2) DEFAULT 9000000.00,  -- Initial budget of Rs.9,000,000
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES user_roles(role_id)
);

-- Create admin user
INSERT INTO users (username, password, display_name, role_id, budget) 
VALUES ('admin', 'Admin@2025', 'Administrator', 1, 9000000.00);

-- Create regular user
INSERT INTO users (username, password, display_name, role_id, budget) 
VALUES ('spiritx_2025', 'SpiritX@2025', 'SpiritX', 2, 9000000.00);

-- Players table with proper handling of undefined values
CREATE TABLE players (
    player_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    university VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,  -- Batsman, Bowler, All-Rounder
    total_runs INT NOT NULL,
    balls_faced INT NOT NULL,
    innings_played INT NOT NULL,
    wickets INT NOT NULL,
    overs_bowled DECIMAL(6, 2) NOT NULL,  -- Using decimal for partial overs
    runs_conceded INT NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Calculated fields based on the logic with proper handling of undefined values
    batting_strike_rate DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE WHEN balls_faced > 0 THEN (total_runs / balls_faced) * 100 ELSE NULL END
    ) STORED,
    
    batting_average DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE WHEN innings_played > 0 THEN total_runs / innings_played ELSE NULL END
    ) STORED,
    
    -- bowling_balls INT GENERATED ALWAYS AS (
    --     CAST(overs_bowled * 6 AS UNSIGNED)
    -- ) STORED,
    
    -- Handling undefined values in bowling strike rate when wickets = 0
    bowling_strike_rate DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE WHEN wickets > 0 THEN (overs_bowled * 6) / wickets ELSE NULL END
    ) STORED,
    
    economy_rate DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE WHEN overs_bowled > 0 THEN runs_conceded / overs_bowled ELSE NULL END
    ) STORED,
    
    player_points DECIMAL(10, 2) GENERATED ALWAYS AS (
        -- (Batting Strike Rate / 5 + Batting Average × 0.8)
        (CASE WHEN balls_faced > 0 THEN ((total_runs / balls_faced) * 100) / 5 ELSE 0 END) + 
        (CASE WHEN innings_played > 0 THEN (total_runs / innings_played) * 0.8 ELSE 0 END) +
        
        -- (500 / Bowling Strike Rate + 140 / Economy Rate)
        -- Handle undefined bowling strike rate (treat as 0 in points calculation)
        (CASE 
            WHEN wickets > 0 THEN 500 / ((overs_bowled * 6) / wickets)
            ELSE 0
        END) +
        (CASE 
            WHEN overs_bowled > 0 THEN 140 / (runs_conceded / overs_bowled)
            ELSE 0
        END)
    ) STORED,
    
    player_value DECIMAL(12, 2) GENERATED ALWAYS AS (
        -- Value in Rupees = (9 × Points + 100) × 1000
        -- Round to nearest 50,000
        ROUND(
            (9 * (
                -- (Batting Strike Rate / 5 + Batting Average × 0.8)
                (CASE WHEN balls_faced > 0 THEN ((total_runs / balls_faced) * 100) / 5 ELSE 0 END) + 
                (CASE WHEN innings_played > 0 THEN (total_runs / innings_played) * 0.8 ELSE 0 END) +
                
                -- (500 / Bowling Strike Rate + 140 / Economy Rate)
                -- Handle undefined bowling strike rate (treat as 0 in points calculation)
                (CASE 
                    WHEN wickets > 0 THEN 500 / ((overs_bowled * 6) / wickets)
                    ELSE 0
                END) +
                (CASE 
                    WHEN overs_bowled > 0 THEN 140 / (runs_conceded / overs_bowled)
                    ELSE 0
                END)
            ) + 100) * 1000 / 50000
        ) * 50000
    ) STORED
);

-- Teams table
CREATE TABLE teams (
    team_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    team_name VARCHAR(100),
    is_complete BOOLEAN GENERATED ALWAYS AS (player_count = 11) STORED,
    player_count INT DEFAULT 0,
    total_points DECIMAL(10, 2) DEFAULT 0,
    total_value DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
);

-- Team Players (Junction table for Users and Players)
CREATE TABLE team_players (
    team_id INT NOT NULL,
    player_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id, player_id),
    FOREIGN KEY (team_id) REFERENCES teams(team_id) ON DELETE CASCADE,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Tournament summary view (for admin panel)
CREATE VIEW tournament_summary AS
SELECT
    (SELECT SUM(total_runs) FROM players) AS overall_runs,
    (SELECT SUM(wickets) FROM players) AS overall_wickets,
    (SELECT name FROM players WHERE total_runs = (SELECT MAX(total_runs) FROM players)) AS highest_run_scorer,
    (SELECT total_runs FROM players WHERE total_runs = (SELECT MAX(total_runs) FROM players)) AS highest_runs,
    (SELECT name FROM players WHERE wickets = (SELECT MAX(wickets) FROM players)) AS highest_wicket_taker,
    (SELECT wickets FROM players WHERE wickets = (SELECT MAX(wickets) FROM players)) AS highest_wickets;

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT 
    u.username,
    u.display_name,
    t.total_points,
    t.is_complete
FROM 
    users u
JOIN 
    teams t ON u.username = t.username
WHERE 
    u.role_id = 2  -- Only show regular users (not admins)
ORDER BY 
    t.total_points DESC;

-- Admin player statistics view
CREATE VIEW admin_player_stats AS
SELECT
    p.player_id,
    p.name,
    p.university,
    p.category,
    p.total_runs,
    p.balls_faced,
    p.innings_played,
    p.wickets,
    p.overs_bowled,
    p.runs_conceded,
    p.batting_strike_rate,
    p.batting_average,
    CASE WHEN p.wickets = 0 THEN 'Undefined' 
         ELSE CAST(p.bowling_strike_rate AS CHAR) 
    END AS bowling_strike_rate,
    p.economy_rate,
    p.player_points,
    p.player_value,
    p.last_updated
FROM
    players p;

-- User player statistics view (hides points)
CREATE VIEW user_player_stats AS
SELECT
    p.player_id,
    p.name,
    p.university,
    p.category,
    p.total_runs,
    p.balls_faced,
    p.innings_played,
    p.wickets,
    p.overs_bowled,
    p.runs_conceded,
    p.batting_strike_rate,
    p.batting_average,
    CASE WHEN p.wickets = 0 THEN 'Undefined' 
         ELSE CAST(p.bowling_strike_rate AS CHAR) 
    END AS bowling_strike_rate,
    p.economy_rate,
    -- Note: player_points is intentionally omitted
    p.player_value
FROM
    players p;

-- Triggers for team management
DELIMITER //

-- Update team statistics when a player is added
CREATE TRIGGER after_player_add
AFTER INSERT ON team_players
FOR EACH ROW
BEGIN
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
END //

-- Update team statistics when a player is removed
CREATE TRIGGER after_player_remove
AFTER DELETE ON team_players
FOR EACH ROW
BEGIN
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
END //

-- Log player changes for real-time updates
CREATE TABLE player_change_log (
    log_id INT AUTO_INCREMENT PRIMARY KEY,
    player_id INT NOT NULL,
    change_type ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    change_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(player_id) ON DELETE CASCADE
);

-- Create trigger to log player changes
CREATE TRIGGER after_player_update
AFTER UPDATE ON players
FOR EACH ROW
BEGIN
    INSERT INTO player_change_log (player_id, change_type)
    VALUES (NEW.player_id, 'UPDATE');
END //

DELIMITER ;

-- Stored procedures for admin operations
DELIMITER //

-- CRUD Operations for Players
-- Create new player
CREATE PROCEDURE admin_create_player(
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
END //

-- Update existing player
CREATE PROCEDURE admin_update_player(
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
END //

-- Delete player
CREATE PROCEDURE admin_delete_player(
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
END //

-- Get tournament summary (for admin panel)
CREATE PROCEDURE get_tournament_summary()
BEGIN
    SELECT * FROM tournament_summary;
END //

-- User procedures

-- Add player to team
CREATE PROCEDURE user_add_player_to_team(
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
END proc_label

DELIMITER //

CREATE PROCEDURE user_add_player_to_team(
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
END proc_label //

CREATE PROCEDURE user_remove_player_from_team(
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
END //

CREATE PROCEDURE get_user_team_details(IN p_username VARCHAR(50))
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
END //

DELIMITER ;