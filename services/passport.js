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
      console.log('accessToken:', accessToken);
      console.log('refreshToken:', refreshToken);
      console.log('profile:', profile);
    }
  )
);
