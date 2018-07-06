/*******************************************************************
 Import the aws-sdk module
********************************************************************/
const AWS = require('aws-sdk');

/*******************************************************************
 Import the uuid module
********************************************************************/
const uuid = require('uuid/v1');

/*******************************************************************
  Import the requireLogin middleware
********************************************************************/
const requireLogin = require('./../middlewares/requireLogin');

/*******************************************************************
  Import the config file -
  It contains the S3 Access Keys
********************************************************************/
const keys = require('./../config/keys');

const s3 = new AWS.S3({
  accessKeyId: keys.accessKeyId,
  secretAccessKey: keys.secretAccessKey
});

module.exports = app => {
  app.get('/api/upload', requireLogin, (req, res) => {
    // The `/` is CRITICAL.
    // We put the `/` to indicate to AWS S3 that we want a folder structure
    // If we do not do this, S3 will simply store the Object (file)
    // in a flat structure (which is what an S3 Bucket is)
    const key = `${req.user.id}/${uuid()}.jpeg`;

    // Refer - https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getSignedUrl-property
    // 'putObject' is the AWS Operation Name that means that we want to put an Object into
    //  a Bucket
    s3.getSignedUrl(
      'putObject',
      {
        Bucket: 'my-blogger-bucket-12345',
        Key: key,
        ContentType: 'image/jpeg'
      },
      (err, url) => {
        // The returned url is of the form
        // https://Bucket/key?AWSAccessKeyId=accessKeyId&Content-Type=ContentType&Expires=1234&Signature=somerandomstring
        res.send({ key, url });
      }
    );
  });
};
