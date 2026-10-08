const http = require('http');
const app = require('./app');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

// Setup WebSocket server
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('New WebSocket client connected');
  
  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  ws.send(JSON.stringify({ type: 'connected', message: 'Connected to TourneyBeach WS' }));
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
