const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

/*******************************************************************
 Require in the 'User' and 'Blog' collection, so that they can
 be created in the database at run time.

 IMP - Import this before the passport Middleware as well as the 
 GraphQL instance, because we will try to retrieve the 'User'
 collection in the passport file, and in order to do that it
 should already have been registered
********************************************************************/
require('./models/user');
require('./models/blog');

/*******************************************************************
 Require the customized 'passport' Middleware
 MUST come after the User model is initialized
********************************************************************/
require('./services/passport');

// Mongoose's built in promise library is deprecated, replace it with
// ES2015 Promise
mongoose.Promise = global.Promise;

/*******************************************************************
 Connect to the mlab MongoDB database

 Log a message on success or failure
********************************************************************/
mongoose.connect(keys.mongoURI);

mongoose.connection
  .once('open', () => console.log('Connected to MongoLab instance.'))
  .on('error', error => console.log('Error connecting to MongoLab:', error));

/*******************************************************************
 Create an Express App
********************************************************************/
const app = express();

/*******************************************************************
 Middleware for the body-parser module
 It parses incoming request bodies in a middleware before
 your handlers, available under the req.body property.

 Reference - https://www.npmjs.com/package/body-parser
********************************************************************/
app.use(bodyParser.json());

/*******************************************************************
 Middleware for the cookie-session module
 Reference - https://www.npmjs.com/package/cookie-session
********************************************************************/
app.use(
  cookieSession({
    keys: [keys.cookieSession],
    maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
  })
);

/*******************************************************************
 Middleware for using the 'passport' module to use the
 'cookie-session' module. In other words, tell 'passport' to use
 cookies to handle authentication
********************************************************************/
app.use(passport.initialize());
app.use(passport.session());

/*******************************************************************
 Require the Route Handlers
********************************************************************/
require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);

/*******************************************************************
 Define the PORT to listen on
********************************************************************/
const PORT = process.env.PORT || 5000;

app.listen(PORT);
