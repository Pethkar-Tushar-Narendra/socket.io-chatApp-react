import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import express from 'express';

const app = express();
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, '/frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/frontend/build/index.html'));
});

const httpServer = http.Server(app);

const io = new Server(httpServer, { cors: { origin: '*' } });
var messages = [{ from: 'System', message: 'Welcome, You can start Chatting' }];

io.on('connection', (socket) => {
  socket.on('onLogin', (user) => {
    //if we want to use userName or user info
  });
  socket.on('sendMessage', (data) => {
    console.log(data);
    io.emit('message', (messages = [...messages, data]));
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Server started at http://localhost:${PORT}`);
});
