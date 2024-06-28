const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const ChatRequest = require('../models/chat');
const User = require('../models/model');

const initializeSocket = (server, corsOptions) => {
  const io = socketIo(server, {
    cors: corsOptions,
  });

  const userSocketMap = new Map();

  io.use(async (socket, next) => {
    const cookieHeader = socket.request.headers.cookie;
    if (cookieHeader) {
      const cookies = cookie.parse(cookieHeader);
      const token = cookies.token;

      if (!token) {
        console.log('User not authenticated: No token found');
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.SESSION_SECRET);
        console.log('Decoded token:', decoded);

        try {
          const user = await User.findById(decoded.userId);
          if (!user) {
            console.log('User not authenticated: User not found');
            return next(new Error('Authentication error: User not found'));
          }

          socket.user = user;
          userSocketMap.set(user.username, socket.id);

          for (const [username, socketId] of userSocketMap.entries()) {
            console.log(`Username: ${username}, Socket ID: ${socketId}`);
          }

          next();
        } catch (err) {
          console.error('Database error:', err);
          return next(new Error('Database error'));
        }
      } catch (err) {
        console.error('Token verification error:', err);
        return next(new Error('Authentication error: Invalid token'));
      }
    } else {
      console.log('User not authenticated: No cookies found');
      return next(new Error('Authentication error: No cookies found'));
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected');



    const usernames = Array.from(userSocketMap.keys());

    console.log("username" + usernames)
    socket.emit("user detail", usernames);


    const myuser = socket.user.username


    const friends = ChatRequest.find({

      status: "accepted",
      $or: [
        { from: myuser },
        { to: myuser }

      ]

    }).then(acceptedRequests => {

      const otherUsers = new Set(acceptedRequests.map(request => {
        return request.from === myuser ? request.to : request.from;
      }));


      const friends = Array.from(otherUsers)


      console.log("friends" + friends)

      socket.emit('friends', friends);
    })
      .catch(err => {
        console.error('Error finding accepted requests:', err);
      })




    socket.on('message', async (data) => {
      console.log(data)
      const { to, message, time } = data;
      const from = socket.user.username;

      try {
        const chatRequest = await ChatRequest.findOne({ from, to });
        if (chatRequest && chatRequest.status === 'accepted') {
          const recipientSocketId = userSocketMap.get(to);
          if (recipientSocketId) {
            io.to(recipientSocketId).emit('message', { from, message, time });
          }
        } else {
          console.log(`Chat request between ${from} and ${to} is not accepted.`);
        }
      } catch (err) {
        console.error("Error sending message:", err);
      }
    });

    socket.on('disconnect', () => {
      if (socket.user) {
        userSocketMap.delete(socket.user.username);
      }
    });

    socket.on("send_chat_request", async (data) => {
      const { to } = data;
      const from = socket.user.username;

      try {
        let connection = await ChatRequest.findOne({ to, from });
        if (connection) {
          console.log("User already requested");
        } else {
          const newRequest = new ChatRequest({ from, to });
          await newRequest.save();
          connection = await ChatRequest.findOne({ to, from });
        }

        const recipientSocketId = userSocketMap.get(to);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("receive_chat_request", connection);
        } else {
          console.log(`User with ID ${to} is not connected.`);
        }
      } catch (err) {
        console.error("Error handling chat request:", err);
      }
    });

    socket.on("accept_chat_request", async (data) => {
      const { requestId } = data;
      try {
        const request = await ChatRequest.findById(requestId);
        if (request) {
          request.status = 'accepted';
          await request.save();

          const senderSocketId = userSocketMap.get(request.from);
          if (senderSocketId) {
            io.to(senderSocketId).emit('chat_request_status_updated', request);
          }
        } else {
          console.log("Chat request not found");
        }
      } catch (err) {
        console.error("Error accepting chat request:", err);
      }
    });

    socket.on("decline_chat_request", async (data) => {
      const { requestId } = data;
      try {
        const request = await ChatRequest.findById(requestId);
        if (request) {
          request.status = 'declined';
          await request.save();

          const senderSocketId = userSocketMap.get(request.from);
          if (senderSocketId) {
            io.to(senderSocketId).emit('chat_request_status_updated', request);
          }
        } else {
          console.log("Chat request not found");
        }
      } catch (err) {
        console.error("Error declining chat request:", err);
      }
    });
  });

  return io;
};

module.exports = initializeSocket;
