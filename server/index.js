const express = require('express');  // Basically nodejs extension. Used to quickly and securely set up routes so we dont' have to manually, for example.

const http = require('http');   // To use the HTTP server and client one must require('http')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const rooms = require('./rooms.js');

const router = require('./router');
const { Console, timeLog } = require('console');

 /* The process object is a global that provides information about, and control over, the current Node.js process.
  As a global, it is always available to Node.js applications without using require().*/
const PORT = process.env.PORT || 5000; 

const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });
  

io.on('connection', (socket) => {

  socket.emit('getRooms', rooms);

  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });
    
    if (error) {
      return callback(error);
    };

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });

    //socket.broadcast sends a message to everyone besides that specific user
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` }); 

    socket.join(user.room);

    
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
    
    callback(); //callback gets called in frontend if we want to do something with it
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    
    io.to(user.room).emit('message', { user: user.name, text: message });
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.io);

    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` })
    }
  });
    
});


app.use(router);
 
server.listen(PORT, () => console.log(`Server has started on port ${PORT}`)); 