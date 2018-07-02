/*******************************************************************
  Middleware function which checks if there is a `user` property on
  the `req` Object.

  If there is, it means the user has authenticated themselves.
  We know this because, `passport` attaches the `user` property to
  the `req` Object in the `passport.initialize()` and
  `passport.session()` middlewares.
********************************************************************/

module.exports = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .send({ error: 'You must be authenticated to access this resource!!' });
  }

  next();
};
