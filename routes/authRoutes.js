/*******************************************************************
  Export a function which contains the definitions of all the
  route handlers.

  This function assumes that the express 'app' will be provided as
  an input argument
********************************************************************/
module.exports = app => {
  // Authentication Route Handler
  app.get('/', (req, res) => {
    // req.session
    res.send('Connected');
  });
};
