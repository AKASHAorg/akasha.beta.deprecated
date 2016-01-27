import React, { Component } from 'react';
import { Link } from 'react-router';


export default class Home extends Component {
  render() {
    console.dir(this._reactInternalInstance);
    return (
      <div>
        <div>
          <h2>Homeaa</h2>
          <Link to="/counter">to Counters</Link>
        </div>
      </div>
    );
  }
}
