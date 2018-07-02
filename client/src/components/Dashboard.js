import React from 'react';
import { Link } from 'react-router-dom';

import BlogList from './blogs/BlogList';

export default () => {
  return (
    <div className="fixed-action-btn">
      <BlogList />
      <Link to="/surveys/new" className="btn-floating btn-large red">
        <i className="large material-icons">add</i>
      </Link>
    </div>
  );
};
