import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form'; // ES6
import { Link } from 'react-router-dom';
import BlogField from './BlogField';
import formFields from './formFields';

class BlogForm extends Component {
  renderFields() {
    return formFields.map(field => {
      return (
        <Field
          name={field.name}
          key={field.name}
          type="text"
          component={BlogField}
          label={field.label}
        />
      );
    });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onBlogSubmit)}>
          {this.renderFields()}
          <Link to="/blogs" className="red btn-flat white-text">
            Cancel
          </Link>
          <button type="submit" className="teal btn-flat right white-text">
            Next
            <i className="material-icons right">done</i>
          </button>
        </form>
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  formFields.forEach(({ name }) => {
    if (!values[name]) {
      errors[name] = 'You must provide a value';
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: 'blogForm',
  destroyOnUnmount: false
})(BlogForm);
