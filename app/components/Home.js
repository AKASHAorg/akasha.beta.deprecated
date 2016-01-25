import React, { Component } from 'react';
import { Link } from 'react-router';
import styles from './Home.module.css';


export default class Home extends Component {
  render() {
    return (
      <div>
        <div className={styles.container}>
          <h2>Homeaa</h2>
          <Link to="/counter">to Counters</Link>
        </div>
      </div>
    );
  }
}
