// Import the mongoose module
const mongoose = require('mongoose');

// Import the 'Schema' property from the mongoose module
const { Schema } = mongoose;

// Declare the User Mongoose Schema
const userSchema = new Schema({
  googleId: String,
  displayName: String
});

// Create a model class -> 'user' collection
mongoose.model('user', userSchema);
