# Spirit11 - Fantasy Cricket League

Spirit11 is a fantasy cricket league where users can build their own dream teams from real university players, analyze statistics, and compete with others for the top spot on the leaderboard.

## 🚀 Features

### Admin Panel
- **Players Management:** View, add, edit, and delete players
  - Add players with detailed batting and bowling statistics
  - Edit existing player information and performance metrics
  - Delete players who are not part of any team
- **Player Stats:** Detailed statistics for each player
- **Tournament Summary:** Overall analysis of all players in the tournament
- **Admin Dashboard:** Quick overview of tournament statistics

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
- **Authentication:** NextAuth.js with role-based access control

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

### Step 4: Set up admin access
After setting up the database, ensure the admin user is created by visiting:
```
http://localhost:3000/api/setup-admin
```
This endpoint will create the admin user if it doesn't exist or update its password if it does.

### Step 5: Start the development server
```bash
npm run dev
```

### Step 6: Access the application
Open your browser and navigate to `http://localhost:3000`

## 📱 User Guide

### Admin Access
- Navigate to `/auth/login`
- Use the following credentials:
  - Username: `admin`
  - Password: `Admin@2025`
- Access the admin panel at `/admin` to manage players, view statistics, and analyze tournament data
- The admin dashboard shows quick tournament statistics including highest run scorers and wicket takers

### Regular User
1. Sign up with a username and password or use the demo account:
   - Username: `spiritx_2025`
   - Password: `SpiritX@2025`
2. Browse players in the "Players" tab
3. Build your team in the "Select Team" tab
4. Manage your team in the "Team" tab
5. Monitor your budget in the "Budget" tab
6. Check your ranking in the "Leaderboard" tab

## 💾 Database Schema

The complete database schema is available in the `database.sql` file in the root directory. This file contains:

- Table definitions for users, user_roles, players, teams, and team_players
- Calculated fields for player statistics (battingStrikeRate, battingAverage, etc.)
- Calculation logic for player points and player value
- Views for tournament summary, leaderboard, and player statistics
- Stored procedures for admin and user operations
- Triggers for team management (adding/removing players)

### Key Database Features

1. **Role-Based Authentication**
   - Admin users (role_id = 1) have access to management features
   - Regular users (role_id = 2) can only manage their own teams
   - Authentication is managed using NextAuth.js with custom session handling

2. **Proper Null Handling**
   - Statistics are properly handled when division by zero would occur
   - Bowling statistics show as "Undefined" when appropriate

3. **Tournament Summary View**
   - Quickly access overall runs, wickets, and top performers
   - Displayed on the admin dashboard

4. **Admin Management**
   - Dedicated stored procedures for CRUD operations
   - Player change tracking for monitoring updates

5. **Security Features**
   - Role-based access control for routes and API endpoints
   - Consistent navigation bar with context-aware links

This SQL file is particularly useful for team members who want to understand the database structure or need to set up the database manually.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements
- All university cricket players for their data
- The Spirit11 development team 