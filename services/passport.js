/*******************************************************************
  Import the passport.js module
********************************************************************/
const passport = require('passport');

/*******************************************************************
  Import the Google+ OAuth Strategy -
  https://github.com/jaredhanson/passport-google-oauth2
********************************************************************/
const GoogleStrategy = require('passport-google-oauth20').Strategy;

/*******************************************************************
  Import the config file -
  It contains the Google Client ID and Google Client Secret
********************************************************************/
const keys = require('./../config/keys');

/*******************************************************************
 Import the mongoose module
********************************************************************/
const mongoose = require('mongoose');

/*******************************************************************
  Fetch the 'user' collection
********************************************************************/
const User = mongoose.model('user');

/*******************************************************************
  Authentication -
  Use passport.js serializeUser() method to serialize the User into
  a session cookie

  Reference - http://passportjs.org/docs/configure
********************************************************************/
passport.serializeUser((user, done) => {
  // Serialize the id coming from MongoDB
  done(null, user.id);
});

/*******************************************************************
  Authentication -
  Use passport.js deserializeUser() method to deserialize the
  session cookie and retrieve the user from the fetched id

  Reference - http://passportjs.org/docs/configure
********************************************************************/
passport.deserializeUser(async (id, done) => {
  const newUser = await User.findById(id);
  done(null, newUser);
});

/*******************************************************************
  Tell the base passport module that there is a new Strategy that
  we would like to use for User Authentication

  This is basically registering the Google+ OAuth Strategy with
  passport

  We do this by defining a new instance of the Google+ OAuth Strategy,
  and defining some configuration settings

  The most IMPORTANT configuration settings are the
    1. clientID and
    2. clientSecret

  These 2 are obtained from the Google+ OAuth API
  Reference - http://console.developers.google.com

  The 3rd configuration setting is the re-direct route
  that Google+ API will re-direct the User to once they have given
  permission that our application can access their Google profile
  Google+ API will add a 'code' to this route which will serve as
  a token that our application must use for subsequent requests
********************************************************************/
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // Search for an existing model instance having the provided profile.id
      const existingUser = await User.findOne({ googleId: profile.id });

      // Check if we were able to find a User in our database with the provided
      // profile.id
      if (!existingUser) {
        // If there isn't an existing User,
        // Create a new model instance -> MongoDB document
        // Persist the new User document to the mlab MongoDB database
        const newUser = await new User({
          googleId: profile.id,
          displayName: profile.displayName
        }).save();

        done(null, newUser);
      } else {
        // If the user already exists in our MongoDB, we just exit out
        // via done(err, res) method
        done(null, existingUser);
      }
    }
  )
);
