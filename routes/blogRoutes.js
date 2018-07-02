/*******************************************************************
 Import the mongoose module
********************************************************************/
const mongoose = require('mongoose');

/*******************************************************************
  Import the requireLogin middleware
********************************************************************/
const requireLogin = require('./../middlewares/requireLogin');

/*******************************************************************
  Fetch the 'blog' collection

  This fetching is solely for the purposes of avoiding issues when
  using a Testing library, which might error out thinking we
  are attempting to import the 'Survey' model multiple times if
  we had this code -
  const Blog = require('./../models/blog');
********************************************************************/
const Blog = mongoose.model('blog');

module.exports = app => {
  // Route Handler for fetching a Blog having a specific Id
  // and belonging to the logged in User
  app.get('/api/blogs/:id', requireLogin, async (req, res) => {
    const blog = await Blog.findOne({ _user: req.user.id, _id: req.params.id });

    res.send(blog);
  });

  // Route Handler for fetching ALL Blogs belonging to the
  // logged in User
  app.get('/api/blogs', requireLogin, async (req, res) => {
    const blogs = await Blog.find({ _user: req.user.id });

    res.send(blogs);
  });

  // Route Handler for creating a new Blog document for the
  // looged in User
  app.post('/api/blogs', requireLogin, async (req, res) => {
    const title = req.body.title;
    const content = req.body.content;

    const blog = new Blog({
      title,
      content,
      _user: req.user.id
    });

    try {
      await blog.save();

      res.send(blog);
    } catch (error) {
      res.send(500, error);
    }
  });
};
