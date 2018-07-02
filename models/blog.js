// Import the mongoose module
const mongoose = require('mongoose');

// Import the 'Schema' property from the mongoose module
const { Schema } = mongoose;

// Declare the Blog Mongoose Schema
const blogSchema = new Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
  _user: { type: Schema.Types.ObjectId, ref: 'user' }
});

// Create a model class -> 'blog' collection
mongoose.model('blog', blogSchema);
