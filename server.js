const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: true,
}));
// This is basic express session({..}) initialization.
app.use(passport.initialize());
// Initialize passport on every route call.
app.use(passport.session());
//allow passport to use "express-session"
app.use((req,res,next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
})
app.use('/', require('./routes'));

  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },  
  function(accessToken, refreshToken, profile, done) {
    // In a real application, you would save the user info to your database here.
    return done(null, profile);
  }
));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, user);
});

app.get('/', (req, res) => {res.send(req.session.user !== undefined ? `Logged in as ${req.session.user.username}` : 'Logged out')});

app.get('/github/callback', passport.authenticate('github', { 
  failureRedirect: '/api-docs', session: false }),
    (req, res) => {
    // Successful authentication, redirect home.
    req.session.user = req.user;
    res.redirect('/');
  });

mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(PORT, () => {console.log(`Running on port ${PORT}`)});
  }
});