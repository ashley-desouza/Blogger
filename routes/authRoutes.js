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

  // User Logout Route Handler
  app.get('/api/logout', (req, res) => {
    // The logout() method is attached to the req Object by passportjs
    // When the logout() method is invoked, passport will kill the User Object
    // that is inserted inside the cookie
    // Hence, invoking req.user will return undefined
    req.logout();
    res.send(req.user);
  });

  // Route Handler to get the current logged in User
  app.get('/api/current_user', (req, res) => {
    // req.session
    res.send(req.user);
  });
};
