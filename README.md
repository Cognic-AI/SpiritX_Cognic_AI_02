# Spirit11 Fantasy Cricket Game

Spirit11 is an interactive fantasy cricket platform designed for inter-university cricket competitions. Built with Next.js and featuring real-time updates, comprehensive player statistics, competitive team management, and AI-powered team suggestions for intelligent player recommendations and strategy optimization.

## Features

- **Real-Time Updates**: Live player performance tracking and point calculations
- **Budget Management**: Strategic team building with Rs. 9,000,000 budget
- **Leaderboard**: Live leaderboard for tracking top performering teams
- **Player Statistics**: Detailed batting and bowling statistics for informed decision-making
- **University Competition**: Inter-university competitive gameplay
- **Secure Authentication**: Role-based access control with user and admin features
- **AI-Powered Team Suggestions**: Intelligent player recommendations and strategy optimization

## Tech Stack

- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Node.js, MySQL
- **Authentication**: NextAuth.js
- **AI Integration**: Google Gemini API for intelligent team suggestions

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up the database:
```bash
mysql -u root -p < database_setup.sql
mysql -u root -p < database_data.sql
```
4. Create a `.env` file in the root directory with the following variables:
```bash
# Database Configuration
DB_HOST = Your MySQL host (default: localhost)
DB_USER = MySQL username
DB_PORT = MySQL port (default: 3306)
DB_PASSWORD = MySQL password
DB_NAME = Database name (default: spirit11)

# Authentication
NEXTAUTH_SECRET=your_generated_secret_key
  # Generate a random string using OpenSSL
  openssl rand -base64 32
  
# AI Integration
GEMINI_API_KEY=your_gemini_api_key
```
5. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js 14 app directory structure
- `/app/api` - API routes for player management and authentication
- `/app/_components` - Reusable React components
- `/app/(user)` - User-specific pages and layouts
- `/python_backend` - AI-powered chat assistant for team selection