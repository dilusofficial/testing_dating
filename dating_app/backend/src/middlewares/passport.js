const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();
const User=require('../models/model')

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


passport.serializeUser((user, done) => {
  done(null, user.id); // Store user ID in the session
});


passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  }).catch(err => done(err, null));
});




passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback",
  passReqToCallback: true,
},
(request, accessToken, refreshToken, profile, done)=> {
  User.findOne({googleId: profile.id}).then((currentUser) => {
    if(currentUser){
        // already have this user
        console.log('user is: ', currentUser);
        done(null, currentUser);
    } else {
        // if not, create user in our db
        new User({
            googleId: profile.id,
            username: profile.displayName
        }).save().then((newUser) => {
            console.log('created new user: ', newUser);
            done(null, newUser);
        });
    } 
 
})}));


