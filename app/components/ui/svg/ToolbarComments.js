import React, { Component } from 'react';

export default class ToolbarComments extends Component {
  render () {
    return (
      <g {...this.props}>
        <path d="M8,2A6,6,0,0,1,8,14H2V8A6,6,0,0,1,8,2M8,1A7,7,0,0,0,1,8v7H8A7,7,0,0,0,8,1H8Z"/>
        <circle cx="4.82" cy="8" r="0.95"/>
        <circle cx="8" cy="8" r="0.95"/>
        <circle cx="11.18" cy="8" r="0.95"/>
      </g>
    );
  }
}
