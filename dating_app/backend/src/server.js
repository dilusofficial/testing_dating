const express=require('express')
const cors=require('cors')
const apiRouter = require('./routes');
const app = express();
const port = process.env.PORT || 3000;
const passportsetup=require('./middlewares/passport')
const connnectToDatabase=require('../database/db')
const cookieSession = require('cookie-session');
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');



app.use(session({
  secret: process.env.cookie, // Secret key for signing the session ID cookie
  resave: false, // Don't save session if unmodified
  saveUninitialized: true, // Save uninitialized sessions to store
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  }
}));


app.use(passport.initialize());
app.use(passport.session());



app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));




app.use('/api', apiRouter);



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });