import React, { Component } from 'react';

export default class MenuEntries extends Component {
  render () {
    return (
      <g {...this.props}>
        <path d="M9,9V23h9.71L23,18.71V9H9Zm1,1H22v8H18v4H10V10Zm11.29,9L19,21.29V19h2.29Z" />
        <rect height="1"
              width="8"
              x="12"
              y="12"

        />
        <rect height="1"
              width="8"
              x="12"
              y="15"
        />
      </g>
    );
  }

}
