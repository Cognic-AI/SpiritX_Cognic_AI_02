-- Create database
CREATE DATABASE spirit11;
USE spirit11;

-- Users table
CREATE TABLE users (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(255) NOT NULL,  -- Should be hashed in actual implementation
    display_name VARCHAR(100),
    budget DECIMAL(12, 2) DEFAULT 9000000.00,  -- Initial budget of Rs.9,000,000
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Players table
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
    
    -- Calculated fields based on the logic
    batting_strike_rate DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE WHEN balls_faced > 0 THEN (total_runs / balls_faced) * 100 ELSE 0 END
    ) STORED,
    
    batting_average DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE WHEN innings_played > 0 THEN total_runs / innings_played ELSE 0 END
    ) STORED,
    
    bowling_balls DECIMAL(10, 2) GENERATED ALWAYS AS (
        overs_bowled * 6
    ) STORED,
    
    bowling_strike_rate DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE WHEN wickets > 0 THEN (overs_bowled * 6) / wickets ELSE 999 END  -- Using 999 for no wickets
    ) STORED,
    
    economy_rate DECIMAL(10, 2) GENERATED ALWAYS AS (
        CASE WHEN overs_bowled > 0 THEN runs_conceded / overs_bowled ELSE 999 END
    ) STORED,
    
    player_points DECIMAL(10, 2) GENERATED ALWAYS AS (
        -- (Batting Strike Rate / 5 + Batting Average × 0.8)
        (CASE WHEN balls_faced > 0 THEN ((total_runs / balls_faced) * 100) / 5 ELSE 0 END) + 
        (CASE WHEN innings_played > 0 THEN (total_runs / innings_played) * 0.8 ELSE 0 END) +
        
        -- (500 / Bowling Strike Rate + 140 / Economy Rate)
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

-- Leaderboard view
CREATE VIEW leaderboard AS
SELECT 
    u.username,
    u.display_name,
    t.total_points
FROM 
    users u
JOIN 
    teams t ON u.username = t.username
WHERE 
    t.is_complete = TRUE
ORDER BY 
    t.total_points DESC;

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

DELIMITER ;

-- Sample data insertion for the specified user
INSERT INTO users (username, password, display_name, budget) 
VALUES ('spiritx_2025', 'SpiritX@2025', 'SpiritX', 9000000.00);

-- Create team for the user
INSERT INTO teams (username, team_name) 
VALUES ('spiritx_2025', 'SpiritX Team'); 