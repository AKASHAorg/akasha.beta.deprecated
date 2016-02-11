import React, { Component } from 'react';
import { Link } from 'react-router';
import {SyncProgress} from './ui/CicularProgress';

export default class Home extends Component {
  render() {
    return (
      <div>
        <div>
          <h2>Homeaa</h2>
          <Link to="/counter">to Counters</Link>
          <SyncProgress value={100} strokeWidth={1.5} />
        </div>
      </div>
    );
  }
}
