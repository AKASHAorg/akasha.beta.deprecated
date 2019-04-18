import React, { Component } from 'react';

export default class MenuPortals extends Component {
    render () {
        return (
            <g { ...this.props }>
                <path d="M9,15h6V9H9v6Zm1-5h4v4H10V10Z"/>
                <path d="M17,9v6h6V9H17Zm5,5H18V10h4v4Z"/>
                <path d="M9,23h6V17H9v6Zm1-5h4v4H10V18Z"/>
                <path d="M17,23h6V17H17v6Zm1-5h4v4H18V18Z"/>
            </g>
        );
    }
}

