// import { db } from "@repo/db"

import { createServer } from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import { getEnv } from './utils';

const server = createServer((req, res) => {
    console.log('Received request for ' + req.url);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    ws.on('error', console.error);

    ws.on('message', (message: WebSocket.RawData) => {
        console.log('Received message => ' + message.toString());
    });

    ws.send('Hello! Message From Server!!');
});

server.listen(getEnv('PORT'), () => {
    console.log('Server is listening on port ' + getEnv('PORT'));
});
