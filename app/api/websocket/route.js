import { NextResponse } from 'next/server';
import { WebSocketServer } from 'ws';

// Initialize WebSocket server only once
let wss;

if (!global.wss) {
  // Only create a WebSocket server on the server side
  if (typeof window === 'undefined') {
    const server = require('http').createServer();
    wss = new WebSocketServer({ noServer: true });
    
    // Store the WebSocket server in the global object
    global.wss = wss;
    
    // Handle WebSocket connections
    server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });
    
    // Start WebSocket server
    server.listen(3001, () => {
      console.log('WebSocket server is running on port 3001');
    });
  }
}

// This is a dummy API route to satisfy Next.js routing requirements
export async function GET() {
  return NextResponse.json({
    message: 'WebSocket server is running on port 3001',
  });
} 