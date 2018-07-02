import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlogs } from './../../actions';

class BlogList extends Component {
  componentDidMount() {
    this.props.fetchBlogs();
  }

  renderBlogs() {
    return this.props.blogs.reverse().map(blog => {
      return (
        <div className="card darken-1 horizontal" key={blog._id}>
          <div className="card-stacked">
            <div className="card-content">
              <span className="card-title">{blog.title}</span>
              <p>{blog.content}</p>
            </div>
            <div className="card-action">
              <Link to={`/blogs/${blog._id}`}>Read</Link>
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    return <div>{this.renderBlogs()}</div>;
  }
}

function mapStateToProps(state) {
  return {
    blogs: state.blogs
  };
}
export default connect(
  mapStateToProps,
  { fetchBlogs }
)(BlogList);
