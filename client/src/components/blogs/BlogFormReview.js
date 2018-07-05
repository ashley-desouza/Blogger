// BlogFormReview shows users their form inputs for review
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from './../../actions';
import { withRouter } from 'react-router-dom';
import formFields from './formFields';

class BlogFormReview extends Component {
  renderFields() {
    const { formValues } = this.props;

    return formFields.map(({ name, label }) => {
      return (
        <div key={name}>
          <label>{label}</label>
          <div>{formValues[name]}</div>
        </div>
      );
    });
  }

  renderButtons() {
    const { onCancel } = this.props;

    return (
      <div>
        <button
          className="yellow darken-3 white-text btn-flat"
          onClick={onCancel}
        >
          Back
        </button>
        <button className="green btn-flat right white-text">
          Save Blog
          <i className="material-icons right">email</i>
        </button>
      </div>
    );
  }

  onSubmit(event) {
    event.preventDefault();

    const { submitBlog, history, formValues } = this.props;

    submitBlog(formValues, history);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit.bind(this)}>
        <h5>Please confirm your entries</h5>
        {this.renderFields()}

        {this.renderButtons()}
      </form>
    );
  }
}

function mapStateToProps(state) {
  // console.log(state); Helps to figure out where the Form Data is located.
  return {
    formValues: state.form.blogForm.values
  };
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(BlogFormReview));
