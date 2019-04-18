import React, { Component } from 'react';

export default class ToolbarComments extends Component {
    render () {
        return (
            <g { ...this.props }>
                <polygon points="1.68 15 1 14.34 13.98 1 14.66 1.67 1.68 15"/>
                <polygon
                    points="14.29 14.98 10.47 10.63 6.66 14.98 5.94 14.35 10.47 9.18 15 14.35 14.29 14.98"
                />
                <polygon
                    points="5.84 6.82 1.31 1.65 2.02 1.02 5.84 5.37 9.65 1.02 10.37 1.65 5.84 6.82"/>
            </g>
        );
    }
}
