import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample players
  const samplePlayers = [
    {
      name: "Rohit Kumar",
      university: "Delhi University",
      category: "Batsman",
      totalRuns: 550,
      ballsFaced: 420,
      inningsPlayed: 15,
      wickets: 0,
      oversBowled: 0,
      runsConceded: 0
    },
    {
      name: "Vikas Singh",
      university: "Mumbai University",
      category: "Bowler",
      totalRuns: 120,
      ballsFaced: 150,
      inningsPlayed: 12,
      wickets: 25,
      oversBowled: 45.2,
      runsConceded: 310
    },
    {
      name: "Rahul Desai",
      university: "Pune University",
      category: "All-Rounder",
      totalRuns: 380,
      ballsFaced: 320,
      inningsPlayed: 14,
      wickets: 18,
      oversBowled: 38.5,
      runsConceded: 280
    },
    {
      name: "Suresh Patel",
      university: "Gujarat University",
      category: "Batsman",
      totalRuns: 620,
      ballsFaced: 480,
      inningsPlayed: 16,
      wickets: 0,
      oversBowled: 0,
      runsConceded: 0
    },
    {
      name: "Arjun Nair",
      university: "Kerala University",
      category: "Bowler",
      totalRuns: 80,
      ballsFaced: 110,
      inningsPlayed: 10,
      wickets: 32,
      oversBowled: 50.4,
      runsConceded: 290
    },
  ];

  for (const playerData of samplePlayers) {
    // Calculate derived fields
    const battingStrikeRate = playerData.ballsFaced > 0 
      ? (playerData.totalRuns / playerData.ballsFaced) * 100 
      : 0;
    
    const battingAverage = playerData.inningsPlayed > 0 
      ? playerData.totalRuns / playerData.inningsPlayed 
      : 0;
    
    const bowlingBalls = playerData.oversBowled * 6;
    
    const bowlingStrikeRate = playerData.wickets > 0 
      ? bowlingBalls / playerData.wickets 
      : 999;
    
    const economyRate = playerData.oversBowled > 0 
      ? playerData.runsConceded / playerData.oversBowled 
      : 999;
    
    // Calculate player points
    let playerPoints = 0;
    
    // Batting component
    if (playerData.ballsFaced > 0) {
      playerPoints += battingStrikeRate / 5;
    }
    
    if (playerData.inningsPlayed > 0) {
      playerPoints += battingAverage * 0.8;
    }
    
    // Bowling component
    if (playerData.wickets > 0) {
      playerPoints += 500 / bowlingStrikeRate;
    }
    
    if (playerData.oversBowled > 0) {
      playerPoints += 140 / economyRate;
    }
    
    // Calculate player value
    const exactValue = (9 * playerPoints + 100) * 1000;
    const playerValue = Math.round(exactValue / 50000) * 50000;

    // Create the player
    await prisma.player.upsert({
      where: { 
        id: 0  // This will always fail to find, causing an upsert
      },
      update: {},  // This won't be used since the where condition will never match
      create: {
        name: playerData.name,
        university: playerData.university,
        category: playerData.category,
        totalRuns: playerData.totalRuns,
        ballsFaced: playerData.ballsFaced,
        inningsPlayed: playerData.inningsPlayed,
        wickets: playerData.wickets,
        oversBowled: playerData.oversBowled,
        runsConceded: playerData.runsConceded,
        battingStrikeRate,
        battingAverage,
        bowlingBalls,
        bowlingStrikeRate,
        economyRate,
        playerPoints,
        playerValue,
      },
    });
  }

  console.log('Seed data inserted successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 