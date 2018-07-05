/*******************************************************************
  Middleware function which clears the Redis Cache for a
  provided Hash Key.
********************************************************************/
/*******************************************************************
  Import the clearCache function from the 'redis' service
********************************************************************/
const { clearHash } = require('./../services/redis');

module.exports = async (req, res, next) => {
  /*****************************************************************
    VERY VERY IMPORTANT -
    
    This line of code tells the Middleware to await until the
    Express Route Handler has completed execution, and only then
    proceed with it's own code block
  ******************************************************************/
  await next();

  // Invoke the function to clear the cache
  // using the User Id as the Hash Key,
  // because that is the Hash Key we used for saving
  // queries in our Redis Cache Server
  clearHash(req.user.id);
};
