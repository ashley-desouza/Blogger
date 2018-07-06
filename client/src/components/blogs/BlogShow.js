import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchBlog } from '../../actions';

class BlogShow extends Component {
  componentDidMount() {
    this.props.fetchBlog(this.props.match.params._id);
  }

  renderImages() {
    if (this.props.blog.imageUrl) {
      return (
        <img
          src={`${process.env.REACT_APP_AWS_DOMAIN}/${
            process.env.REACT_APP_AWS_S3_BUCKET
          }/${this.props.blog.imageUrl}`}
        />
      );
    }
  }

  render() {
    if (!this.props.blog) {
      return '';
    }

    const { title, content } = this.props.blog;

    return (
      <div>
        <h3>{title}</h3>
        <p>{content}</p>
        {this.renderImages()}
      </div>
    );
  }
}

function mapStateToProps({ blogs }, ownProps) {
  return { blog: blogs[ownProps.match.params._id] };
}

export default connect(
  mapStateToProps,
  { fetchBlog }
)(BlogShow);
