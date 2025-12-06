import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir les fichiers statiques du build frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Route catch-all pour le SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const rooms = {}; // Store room codes

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId, code) => {
    if (rooms[roomId] && rooms[roomId] !== code) {
      socket.emit('invalid-code');
      return;
    }
    if (!rooms[roomId]) {
      rooms[roomId] = code;
    }
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', socket.id);

    socket.on('offer', (offer, to) => {
      socket.to(to).emit('offer', offer, socket.id);
    });

    socket.on('answer', (answer, to) => {
      socket.to(to).emit('answer', answer, socket.id);
    });

    socket.on('ice-candidate', (candidate, to) => {
      socket.to(to).emit('ice-candidate', candidate, socket.id);
    });

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', socket.id);
    });
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});