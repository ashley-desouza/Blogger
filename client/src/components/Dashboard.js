import React from 'react';
import { Link } from 'react-router-dom';

import BlogList from './blogs/BlogList';

export default () => {
  return (
    <div>
      <BlogList />
      <div className="fixed-action-btn">
        <Link to="/blogs/new" className="btn-floating btn-large red">
          <i className="large material-icons">add</i>
        </Link>
      </div>
    </div>
  );
};
