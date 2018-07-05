/*******************************************************************
 Import the mongoose module
********************************************************************/
const mongoose = require('mongoose');

/*******************************************************************
  Import the requireLogin middleware
********************************************************************/
const requireLogin = require('./../middlewares/requireLogin');

/*******************************************************************
  Import the cleanCache middleware
********************************************************************/
const cleanCache = require('./../middlewares/cleanCache');

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
    try {
      const blog = await Blog.findOne({
        _user: req.user.id,
        _id: req.params.id
      });

      res.send(blog);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // Route Handler for fetching ALL Blogs belonging to the
  // logged in User
  app.get('/api/blogs', requireLogin, async (req, res) => {
    try {
      const blogs = await Blog.find({ _user: req.user.id })
        .sort({ createdAt: 1 })
        .cache({
          key: req.user.id
        });

      res.send(blogs);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  // Route Handler for creating a new Blog document for the
  // looged in User
  app.post('/api/blogs', requireLogin, cleanCache, async (req, res) => {
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
      res.status(500).send(error);
    }
  });
};
