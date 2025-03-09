// import { NextResponse } from 'next/server';
// import { executeQuery } from '@/lib/db';

// export async function POST(request) {
//   try {
//     const { message } = await request.json();
    
//     if (!message) {
//       return NextResponse.json({ error: 'No message provided' }, { status: 400 });
//     }
    
//     // Process the message and generate a response
//     const response = await generateResponse(message);
    
//     return NextResponse.json({ response });
//   } catch (error) {
//     console.error('Error processing Spiriter request:', error);
//     return NextResponse.json({ 
//       error: 'Failed to process request',
//       details: error.message 
//     }, { status: 500 });
//   }
// }

// // Function to generate mock responses based on the user query
// async function generateResponse(message) {
//   const lowerMessage = message.toLowerCase();
  
//   try {
//     // Player statistics queries
//     if (lowerMessage.includes('best batsman') || lowerMessage.includes('top batsman')) {
//       const topBatsmen = await executeQuery(
//         'SELECT name, university, total_runs, batting_strike_rate FROM players WHERE category = "Batsman" OR category = "All-Rounder" ORDER BY total_runs DESC LIMIT 3'
//       );
      
//       if (topBatsmen && topBatsmen.length > 0) {
//         const bestBatsman = topBatsmen[0];
//         return `The best batsman based on total runs is ${bestBatsman.name} from ${bestBatsman.university} with ${bestBatsman.total_runs} runs at a strike rate of ${typeof bestBatsman.batting_strike_rate === 'number' ? bestBatsman.batting_strike_rate.toFixed(2) : 'N/A'}.`;
//       }
//     }
    
//     if (lowerMessage.includes('best bowler') || lowerMessage.includes('top bowler') || lowerMessage.includes('best economy')) {
//       const topBowlers = await executeQuery(
//         'SELECT name, university, wickets, bowling_economy FROM players WHERE category = "Bowler" OR category = "All-Rounder" ORDER BY bowling_economy ASC LIMIT 3'
//       );
      
//       if (topBowlers && topBowlers.length > 0) {
//         const bestBowler = topBowlers[0];
//         return `The bowler with the best economy is ${bestBowler.name} from ${bestBowler.university} with an economy of ${typeof bestBowler.bowling_economy === 'number' ? bestBowler.bowling_economy.toFixed(2) : 'N/A'} and ${bestBowler.wickets} wickets.`;
//       }
//     }
    
//     // Player comparison
//     if (lowerMessage.includes('compare')) {
//       const players = await executeQuery('SELECT name FROM players');
//       const playerNames = players.map(p => p.name.toLowerCase());
      
//       // Find which players are being compared
//       const mentionedPlayers = playerNames.filter(name => lowerMessage.includes(name));
      
//       if (mentionedPlayers.length >= 2) {
//         return `Comparing these players: ${mentionedPlayers.join(' and ')}. In a real implementation, I would show you detailed statistics comparing these players side by side.`;
//       }
//     }
    
//     // Team building advice
//     if (lowerMessage.includes('build') && lowerMessage.includes('team')) {
//       return "To build a balanced team, aim for 5-6 batsmen, 3-4 bowlers, and 1-2 all-rounders. Focus on players with consistent performance rather than one-off great performances. Also consider the value-for-money aspect - sometimes a mid-range player with great stats is better than an expensive star player.";
//     }
    
//     if (lowerMessage.includes('captain')) {
//       return "When selecting a captain, look for consistent all-rounders or top batsmen who regularly score runs. The captain's performance has a multiplier effect on points, so reliability is key. Players like Dimuth Dhananjaya or Lakshan Vandersay would be good choices based on their all-round capabilities.";
//     }
    
//     if (lowerMessage.includes('university')) {
//       return "Based on our data, University of the Visual & Performing Arts and University of Ruhuna have some of the strongest players. However, player selection should be based on individual performance rather than university affiliation.";
//     }
    
//     // Default responses for unrecognized queries
//     const defaultResponses = [
//       "I can help you with player statistics, team selection advice, and player comparisons. Could you be more specific with your question?",
//       "I'm not sure I understand your question. Try asking about specific players, their statistics, or team building advice.",
//       "I'd be happy to help with cricket information. You can ask me about batting records, bowling statistics, or university team performance.",
//       "That's a bit outside my cricket expertise. I can provide information on player performance, team selection, and fantasy cricket strategy."
//     ];
    
//     return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
//   } catch (error) {
//     console.error('Error generating Spiriter response:', error);
//     return "I'm having trouble accessing the player database right now. Please try again with a question about team building or general cricket strategy.";
//   }
// } 