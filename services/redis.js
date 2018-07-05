/*******************************************************************
 Import the mongoose module
********************************************************************/
const mongoose = require('mongoose');

/*******************************************************************
 Import the util module
********************************************************************/
const util = require('util');

/*******************************************************************
 Import the redis module
********************************************************************/
const redis = require('redis');

/*******************************************************************
 Setup a Redis client connection
********************************************************************/
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);

/*******************************************************************
 Promisify the Redis client's `get` Method
********************************************************************/
client.hget = util.promisify(client.hget);

/**
 * Method to indicate if the current Query Instance should use the
 * Redis Cache Server
 *
 * @param {Object} options - An Object of any options that are
 * provided to the cache Method
 *
 * @return {Query} this
 */
mongoose.Query.prototype.cache = function(options = {}) {
  // Semaphore to indicate that we
  // want to use the Redis Cache Server for
  // this Mongoose Query Instance
  this._useCache = true;

  // Define a Hash Key to use for this Query Instance
  // Remember, to stringify  the incoming key because
  // Redis only works with Strings and Numbers.
  // If no key is provided, default to 'defaultHashKey'
  this._hashKey = JSON.stringify(options.key || 'defaultHashKey');

  /************************************************************************
    Return the Mongoose Query Instance

    This is IMPORTANT because it allows for
    function chaining -
    Example -
    Blog.find({ _user: req.user.id }).cache().limit(10);

    Refer -
    https://github.com/Automattic/mongoose/blob/master/lib/query.js#L1679
  *************************************************************************/
  return this;
};

/*********************************************************************
 Make a copy of the original Mongoose `exec` Method on the `Query`
 Class. Please Refer to -
 https://github.com/Automattic/mongoose/blob/master/lib/query.js#L3308

 The goal behind doing this is that we want to inject some code into
 this Native Method to check if the requested resource is in the
 Redis Cache Server or not.

 If it is present in the Redis Cache Server, then we return that record
 back to the client.

 If it is not, then we forward the request to Mongoose's original
 `exec` Method. We then return the results to the client.
***********************************************************************/
const exec = mongoose.Query.prototype.exec;

/**********************************************************************
 * This is our Implementation of the `exec` method
 * where we check if a record is present in the Redis Cache Server.
 *
 * As we will deal with Promises that need to be awaited to be resolved,
 * DO NOT forget to convert this function to an `async` function.
 *
 * ####Examples:
 *
 * var promise = query.exec();
 * var promise = query.exec('update');
 *
 * query.exec(callback);
 * query.exec('find', callback);
 * @return {Promise}
 ***********************************************************************/
mongoose.Query.prototype.exec = async function() {
  if (!this._useCache) {
    // DO NOT USE THE REDIS CACHE SERVER
    // Get the result from MongoDB
    return exec.apply(this, arguments);
  }

  /************************************************************************
    The getQuery() method 
    Returns the current query conditions as a JSON object.
    Refer - 
    https://github.com/Automattic/mongoose/blob/master/lib/query.js#L1123
  *************************************************************************/
  console.log(this.getQuery());

  /***************************************************************************
    Get the Mongoose Collection Name
  ****************************************************************************/
  console.log(this.mongooseCollection.name);

  /*******************************************************************
    Construct a `key` for a Redis entry
    The `key should be -
      1. unique
      2. consistent

    The `key` is a combination of -
      1. The query being executed on that Collection
      2. The Collection

    Since, Redis works ONLY with Strings and Numbers, convert 
    the generated key into a String using the `JSON.stringify` Method
  ********************************************************************/
  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name
    })
  );

  console.log(key);

  // Check if there is an entry in the Redis Cache server with the
  // generated key
  const cacheValue = await client.hget(this._hashKey, key);

  if (cacheValue) {
    console.log('Results coming from the Redis Cache Server');
    console.log('------------------------------------------');
    // There is an entry in the Redis Cache server with the
    // generated key. Return the result from the Cache Server
    // First, hydrate the MongoDB Model or Array of Models.

    // Parse the JSON do that we can use the `Array.isArray`
    // method on it
    const doc = JSON.parse(cacheValue);

    if (Array.isArray(doc)) {
      // Hydrate the Array of Model Instances
      return doc.map(d => new this.model(d));
    } else {
      // Hydrate a single MongoDB Model Instance
      return new this.model(doc);
    }
  }

  // There is NO entry in the Redis Cache Server with the generated key
  // Get the result from MongoDB
  const result = await exec.apply(this, arguments);

  /*******************************************************************
    Before, returning the results to the client, we should store the
    results in the Redis Cache Server so that if the same request 
    comes in later, we can retrieve the results from the Redis Cache 
    Server.
    Isn't that kinda the point of using a Redis Cache Server

    However, there is 1 issue -
    The `exec` function from the `Query` class in Mongoose returns
    a Promise that resolved to a `MongoDB Model Instance or Document`.

    Hence, if we ever want to return the results from the 
    Redis Cache Server it MUST be a MongoDB Model Instance or 
    Document`.

    The problem is that Redis ONLY works with Strings and Numbers.
    Hence, we must store the `MongoDB Model Instances or Documents`
    as Strings in Redis and then convert them to
    `MongoDB Model Instances or Documents` when we want to return 
    them to the client.
  ********************************************************************/
  client.hset(this._hashKey, key, JSON.stringify(result));

  // Finally, return the result from MongoDB to the client
  return result;
};

const clearHash = function(hashKey) {
  client.del(JSON.stringify(hashKey));
};

module.exports = {
  clearHash
};
