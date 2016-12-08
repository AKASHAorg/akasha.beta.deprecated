import React, { Component } from 'react';

export default class ToolbarWallet extends Component {
    render () {
        return (
          <g {...this.props}>
            <path d="M8,2A4,4,0,1,1,4,6,4,4,0,0,1,8,2M8,1a5,5,0,1,0,5,5A5,5,0,0,0,8,1H8Z" />
            <polygon points="14 8 14 9 14 11 14 14 2 14 2 11 2 9 2 8 1 8 1 15 15 15 15 8 14 8" />
          </g>
        );
    }
}
