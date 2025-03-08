# Spirit11 - Fantasy Cricket League

Spirit11 is a fantasy cricket league where users can build their own dream teams from real university players, analyze statistics, and compete with others for the top spot on the leaderboard.

## 🚀 Features

### Admin Panel
- **Players Management:** View, add, edit, and delete players
- **Player Stats:** Detailed statistics for each player
- **Tournament Summary:** Overall analysis of all players in the tournament

### User Interface
- **Authentication:** Sign up and login using username and password
- **Players View:** Browse all available players and view their stats
- **Team Selection:** Build your dream team within a budget of ₹9,000,000
- **Team Management:** View and manage your selected players
- **Budget Tracking:** Monitor your available and used budget
- **Leaderboard:** Compete with other users for the top spot
- **Spiriter AI Chatbot:** Get assistance with team selection (coming soon)

## 🧮 Logic

### Player Points Calculation
```
Player Points = (Batting Strike Rate / 5 + Batting Average × 0.8) + (500 / Bowling Strike Rate + 140 / Economy Rate)

Batting Strike Rate = (Total Runs / Total Balls Faced) × 100
Batting Average = Total Runs / Innings Played
Bowling Strike Rate = Total Balls Bowled / Total Wickets Taken
Economy Rate = Total Runs Conceded / Total Balls Bowled × 6
```

### Player Value Calculation
```
Value in Rupees = (9 × Points + 100) × 1000
```
The value is rounded to the nearest multiple of 50,000.

## 📋 Tech Stack
- **Frontend:** Next.js, React, TypeScript, TailwindCSS
- **Backend:** Next.js API Routes
- **Database:** MySQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL database server

### Step 1: Clone the repository
```bash
git clone https://github.com/yourusername/spirit11.git
cd spirit11
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up the database
You have two options to set up the database:

#### Option 1: Using Prisma (Recommended for development)
1. Create a MySQL database named `spirit11`
2. Update the `.env` file with your database credentials:
```
DATABASE_URL="mysql://username:password@localhost:3306/spirit11"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```
3. Run database migrations:
```bash
npx prisma migrate dev --name init
```
4. Seed the database with sample data:
```bash
npx prisma db seed
```

#### Option 2: Using Raw SQL (For direct database setup)
1. Use the provided `database.sql` file in the root directory:
```bash
mysql -u username -p < database.sql
```
2. Update the `.env` file with your database credentials:
```
DATABASE_URL="mysql://username:password@localhost:3306/spirit11"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Start the development server
```bash
npm run dev
```

### Step 5: Access the application
Open your browser and navigate to `http://localhost:3000`

## 📱 User Guide

### Admin Access
- Username: `admin`
- Password: `admin123`
- Navigate to `/admin` to access the admin panel

### Regular User
1. Sign up with a username and password
2. Browse players in the "Players" tab
3. Build your team in the "Select Team" tab
4. Manage your team in the "Team" tab
5. Monitor your budget in the "Budget" tab
6. Check your ranking in the "Leaderboard" tab

## 💾 Database Schema

The complete database schema is available in the `database.sql` file in the root directory. This file contains:

- Table definitions for users, players, teams, and team_players
- Calculated fields for player statistics (battingStrikeRate, battingAverage, etc.)
- Calculation logic for player points and player value
- Triggers for team management (adding/removing players)
- Sample data for testing

This SQL file is particularly useful for team members who want to understand the database structure or need to set up the database manually.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
- All university cricket players for their data
- The Spirit11 development team 