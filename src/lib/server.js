const express = require('express');
const bodyParser = require('body-parser');
const routes = require('../../routes/api');
require('dotenv').config();
const Database = require('./database');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBSession = require('connect-mongodb-session')(session);
const morgan = require('morgan')

const app = express();

const store = new MongoDBSession({
  uri: process.env.DB,
  collection: 'mySessions'
})

const port = process.env.PORT || 5000;

app.use(morgan('combined'))

app.use(session({
  secret: 'key that will sign cookie',
  resave: false,
  saveUninitialized: true,
  store: store,
  cookie: {
    secure: true,
  }
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://makersep3gamefrontend.herokuapp.com');
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'POST, GET')
  next();
});

app.use(bodyParser.json());
app.use(cookieParser());

app.use(passport.initialize());

// app.use(passport.session());

// passport config
var User = require('../../models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(routes);

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});