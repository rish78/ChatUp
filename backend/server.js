require('dotenv').config()  
const express = require('express');
const cors = require("cors");
const mongoose = require("mongoose");
const path = require('path');
const socketio = require('socket.io')

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");


const app = express();
app.use(express.json());
app.use(cors());



    app.get('/', (req, res) =>{
      res.status(200).send("Let's go!");
  })



const port = process.env.PORT || 5000;

mongoose                                                                  //connecting to MongoDB using mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(err));



app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

const server = app.listen(port, () => {                                           //Inititating server
    console.log(`Here we go, Engines started at ${port}.`);
  })

const io = socketio(server, {
  cors: {
    origin: "*",  // Or specify allowed origins
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
      socket.join(userData._id);
      console.log(userData._id);
      socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log('User joined room' + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      
      if (user._id == newMessageRecieved.sender._id) return;
      io.in(user._id).emit("message received", newMessageRecieved);
    });
  });
})