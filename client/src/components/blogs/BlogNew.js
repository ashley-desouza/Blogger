// BlogNew shows BlogForm and BlogFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import BlogForm from './BlogForm';
import BlogFormReview from './BlogFormReview';

class BlogNew extends Component {
  // Create-React-App gives us a shortcut to declare Initial Component State
  // instead of using a constructor
  state = { showFormReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <BlogFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }

    return (
      <BlogForm
        onBlogSubmit={() =>
          this.setState({
            showFormReview: true
          })
        }
      />
    );
  }

  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({
  form: 'blogForm'
})(BlogNew);
