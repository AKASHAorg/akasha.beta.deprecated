import React, { Component } from 'react';

export default class MenuAddEntry extends Component {
  render () {
    return (
      <g {...this.props}>
        <polygon
          points="20 12 20 9 19 9 19 12 16 12 16 13 19 13 19 16 20 16 20 13 23 13 23 12 20 12" />
        <polygon
          points="22 22 10 22 10 10 16 10 16 9 10 9 9 9 9 10 9 22 9 23 10 23 22 23 23 23 23 22 23 16 22 16 22 22"
        />
      </g>
    );
  }
}
