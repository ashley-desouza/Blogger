import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

const Landing = () => {
  return <h2>Landing</h2>;
};

export default class App extends Component {
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Route exact path="/" component={Landing} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}
