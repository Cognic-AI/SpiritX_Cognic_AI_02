-- First, ensure the database is selected
USE spirit11;

-- Insert players from the CSV data
INSERT INTO players (name, university, category, total_runs, balls_faced, innings_played, wickets, overs_bowled, runs_conceded) VALUES
('Chamika Chandimal', 'University of the Visual & Performing Arts', 'Batsman', 530, 588, 10, 0, 3, 21),
('Dimuth Dhananjaya', 'University of the Visual & Performing Arts', 'All-Rounder', 250, 208, 10, 8, 40, 240),
('Avishka Mendis', 'Eastern University', 'All-Rounder', 210, 175, 7, 7, 35, 210),
('Danushka Kumara', 'University of the Visual & Performing Arts', 'Batsman', 780, 866, 15, 0, 5, 35),
('Praveen Vandersay', 'Eastern University', 'Batsman', 329, 365, 7, 0, 3, 24),
('Niroshan Mathews', 'University of the Visual & Performing Arts', 'Batsman', 275, 305, 5, 0, 2, 18),
('Chaturanga Gunathilaka', 'University of Moratuwa', 'Bowler', 132, 264, 11, 29, 88, 528),
('Lahiru Rathnayake', 'University of Ruhuna', 'Batsman', 742, 824, 14, 0, 1, 8),
('Jeewan Thirimanne', 'University of Jaffna', 'Batsman', 780, 866, 15, 0, 3, 24),
('Kalana Samarawickrama', 'Eastern University', 'Batsman', 728, 808, 14, 0, 4, 32),
('Lakshan Vandersay', 'University of the Visual & Performing Arts', 'All-Rounder', 405, 337, 15, 15, 75, 450),
('Roshen Samarawickrama', 'University of Kelaniya', 'Bowler', 140, 280, 14, 46, 140, 560),
('Sammu Sandakan', 'University of Ruhuna', 'Bowler', 120, 240, 10, 26, 80, 320),
('Kalana Jayawardene', 'University of Jaffna', 'Bowler', 120, 240, 10, 33, 100, 400),
('Binura Samarawickrama', 'University of the Visual & Performing Arts', 'Bowler', 77, 154, 7, 21, 63, 252),
('Dasun Thirimanne', 'Eastern University', 'Bowler', 121, 242, 11, 29, 88, 440),
('Angelo Samarawickrama', 'University of Kelaniya', 'Batsman', 424, 471, 8, 0, 1, 7),
('Nuwan Jayawickrama', 'University of Ruhuna', 'Batsman', 300, 333, 6, 0, 3, 27),
('Kusal Dhananjaya', 'South Eastern University', 'Batsman', 480, 533, 10, 0, 2, 16),
('Chamika Bandara', 'Eastern University', 'Batsman', 270, 300, 5, 0, 5, 45),
('Dilruwan Shanaka', 'University of Peradeniya', 'Batsman', 384, 426, 8, 0, 5, 45),
('Danushka Jayawickrama', 'University of Peradeniya', 'All-Rounder', 350, 291, 14, 14, 70, 350),
('Charith Shanaka', 'University of Colombo', 'Batsman', 477, 530, 9, 0, 3, 27),
('Asela Nissanka', 'University of Sri Jayewardenepura', 'Batsman', 765, 850, 15, 0, 0, 1),
('Wanindu Hasaranga', 'University of Colombo', 'Bowler', 120, 240, 10, 30, 90, 540),
('Asela Vandersay', 'University of the Visual & Performing Arts', 'Bowler', 154, 308, 14, 37, 112, 448),
('Pathum Fernando', 'University of Peradeniya', 'Batsman', 450, 500, 10, 0, 2, 18),
('Angelo Kumara', 'Eastern University', 'Batsman', 330, 366, 6, 0, 1, 8),
('Danushka Rajapaksa', 'University of Peradeniya', 'Batsman', 441, 490, 9, 0, 5, 35),
('Suranga Shanaka', 'South Eastern University', 'Bowler', 55, 110, 5, 13, 40, 160),
('Pathum Dhananjaya', 'Eastern University', 'Batsman', 360, 400, 8, 0, 1, 9),
('Asela Asalanka', 'South Eastern University', 'Batsman', 550, 611, 11, 0, 0, 1),
('Minod Rathnayake', 'University of Kelaniya', 'Bowler', 154, 308, 14, 37, 112, 448),
('Binura Lakmal', 'University of Kelaniya', 'Batsman', 540, 600, 12, 0, 2, 16),
('Praveen Asalanka', 'Eastern University', 'Batsman', 477, 530, 9, 0, 1, 7),
('Angelo Jayawardene', 'University of Jaffna', 'Batsman', 468, 520, 9, 0, 3, 21),
('Kamindu Asalanka', 'University of Moratuwa', 'Bowler', 135, 270, 15, 45, 135, 810),
('Sadeera Rajapaksa', 'University of Jaffna', 'All-Rounder', 275, 229, 11, 8, 44, 264),
('Sandakan Hasaranga', 'University of Kelaniya', 'Batsman', 795, 883, 15, 0, 1, 7),
('Bhanuka Rajapaksa', 'University of Moratuwa', 'All-Rounder', 364, 303, 14, 11, 56, 336),
('Chamika Rajapaksa', 'University of Ruhuna', 'Batsman', 450, 500, 9, 0, 1, 7),
('Kamindu Lakmal', 'University of the Visual & Performing Arts', 'Batsman', 780, 866, 15, 0, 5, 35),
('Lakshan Gunathilaka', 'University of Peradeniya', 'Bowler', 84, 168, 7, 21, 63, 315),
('Tharindu Thirimanne', 'South Eastern University', 'Batsman', 611, 678, 13, 0, 2, 18),
('Dinesh Samarawickrama', 'University of Jaffna', 'Batsman', 400, 444, 8, 0, 3, 27),
('Suranga Sandakan', 'University of Moratuwa', 'Batsman', 235, 261, 5, 0, 4, 36),
('Sandakan Dickwella', 'University of Jaffna', 'Batsman', 368, 408, 8, 0, 3, 27),
('Sammu Rajapaksa', 'University of Ruhuna', 'Batsman', 240, 266, 5, 0, 2, 16),
('Suranga Bandara', 'University of Moratuwa', 'Bowler', 154, 308, 14, 46, 140, 840),
('Tharindu Embuldeniya', 'University of the Visual & Performing Arts', 'All-Rounder', 264, 220, 12, 12, 60, 360);

-- Create team for spiritx_2025 if it doesn't exist
-- First, check if team exists
SET @team_exists = (SELECT COUNT(*) FROM teams WHERE username = 'spiritx_2025');

-- If team doesn't exist, create it
SET @team_id = NULL;
IF @team_exists = 0 THEN
    INSERT INTO teams (username, team_name) VALUES ('spiritx_2025', 'SpiritX Team');
    SET @team_id = LAST_INSERT_ID();
ELSE
    SET @team_id = (SELECT team_id FROM teams WHERE username = 'spiritx_2025');
END IF;

-- Then add the players to the team
INSERT INTO team_players (team_id, player_id)
SELECT @team_id, player_id FROM players
WHERE name IN (
    'Danushka Kumara',
    'Jeewan Thirimanne',
    'Charith Shanaka',
    'Pathum Dhananjaya',
    'Suranga Bandara',
    'Sammu Sandakan',
    'Minod Rathnayake',
    'Lakshan Gunathilaka',
    'Sadeera Rajapaksa',
    'Danushka Jayawickrama',
    'Lakshan Vandersay'
);

-- Create a helper view for chatbot queries if not exists
-- Note: Checking if view exists before creating it
SET @view_exists = (SELECT COUNT(*) FROM information_schema.VIEWS 
                    WHERE TABLE_SCHEMA = 'spirit11' AND TABLE_NAME = 'player_statistics');

-- Only create the view if it doesn't exist
DELIMITER //
CREATE PROCEDURE create_player_statistics_view()
BEGIN
    IF @view_exists = 0 THEN
        CREATE VIEW player_statistics AS
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
            p.bowling_strike_rate,
            p.economy_rate,
            p.player_value
        FROM
            players p;
    END IF;
END //
DELIMITER ;

CALL create_player_statistics_view();
DROP PROCEDURE IF EXISTS create_player_statistics_view;