const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const socketio = require("./socket/socket")
const http = require('http');

const server = http.createServer(app);


require('./middlewares/passport');


require('../database/db');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 24 * 60 * 60 * 1000,
  }
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: 'http://localhost:5173',


  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const io = socketio(server, corsOptions);



app.use('/api', apiRouter);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
