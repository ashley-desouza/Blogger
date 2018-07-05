import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  renderContent() {
    switch (this.props.user) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
        );
      default:
        return [
          <li key="3" style={{ margin: '0 10px' }}>
            <Link to="/blogs">My Blogs</Link>
          </li>,
          <li key="2">
            <a href="/api/logout">Logout</a>
          </li>
        ];
    }
  }

  render() {
    return (
      <div>
        <nav className="cyan darken-2">
          <div className="nav-wrapper">
            <Link
              to={this.props.user ? '/blogs' : '/'}
              className="left brand-logo"
            >
              Blogger
            </Link>
            <ul id="nav-mobile" className="right hide-on-med-and-down">
              {this.renderContent()}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}
export default connect(mapStateToProps)(Header);
