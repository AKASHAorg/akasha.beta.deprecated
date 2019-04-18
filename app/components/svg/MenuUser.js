import React, { Component } from 'react';

export default class MenuUser extends Component {
    render () {
        return (
            <path
                { ...this.props }
                d="M16,0A16,16,0,1,0,32,16,16,16,0,0,0,16,0Zm0,
      9a4.23,4.23,0,1,1-4.23,4.23A4.22,4.22,0,0,1,16,9Zm0,
      20a10.14,10.14,0,0,1-8.45-4.54c0-2.8,5.63-4.34,
      8.45-4.34s8.41,1.54,8.45,4.34A10.14,10.14,0,0,1,16,29Z"
            />
        );
    }
}

