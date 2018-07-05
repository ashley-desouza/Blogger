import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBlogs } from './../../actions';

class BlogList extends Component {
  componentDidMount() {
    this.props.fetchBlogs();
  }

  renderBlogs() {
    return Object.values(this.props.blogs).map(blog => {
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
