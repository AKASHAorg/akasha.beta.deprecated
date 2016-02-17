import React, { Component } from 'react';

export default class ToolbarProfile extends Component {
  render () {
    return (
      <g {...this.props}>
        <path
          d="M1,1V9H4.29a2,2,0,0,1,.94-0.84s0-.1,0-0.16H2V2H14V8H10.82c0,0.05,0,.11,0,0.16a2,2,0,0,1,.94.84H15V1H1Z"/>
        <path
          d="M10.77,8.16a3,3,0,0,1-.58.88A1,1,0,0,1,11,10v4H5V10a1,1,0,0,1,.81-1,3,3,0,0,1-.58-0.88A2,2,0,0,0,4,
          10v5h8V10A2,2,0,0,0,10.77,8.16Z"/>
        <path d="M8,5A2,2,0,1,1,6,7,2,2,0,0,1,8,5M8,4a3,3,0,1,0,3,3A3,3,0,0,0,8,4H8Z"/>
      </g>
    );
  }
}
