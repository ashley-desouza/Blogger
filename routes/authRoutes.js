// Import the passport.js module
const passport = require('passport');

/*******************************************************************
  Export a function which contains the definitions of all the
  route handlers.

  This function assumes that the express 'app' will be provided as
  an input argument
********************************************************************/
module.exports = app => {
  // OAuth Authentication Route Handler
  app.get(
    '/auth/google',
    passport.authenticate('google', {
      scope: ['profile', 'email']
    })
  );

  // OAuth Authentication Callback Route Handler
  // This is the Route Handler that is defined in the GoogleStrategy
  app.get('/auth/google/callback', passport.authenticate('google'));
};
