const express = require('express');
const mongoose = require('mongoose');
const keys = require('./config/keys');

/*******************************************************************
 Require in the 'User' collection, so that they can
 be created in the database at run time.

 IMP - Import this before the passport Middleware as well as the 
 GraphQL instance, because we will try to retrieve the 'User'
 collection in the passport file, and in order to do that it
 should already have been registered
********************************************************************/
require('./models/user');

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
 Require the Route Handlers
********************************************************************/
require('./routes/authRoutes')(app);

/*******************************************************************
 Define the PORT to listen on
********************************************************************/
const PORT = process.env.PORT || 5000;

app.listen(PORT);
