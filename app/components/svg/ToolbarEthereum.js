import React, { Component } from 'react';

export default class ToolbarEthereum extends Component {
    render () {
        return (
          <g {...this.props}>
            <g>
              <polygon points="5.5 10.65 8 12.12 10.5 10.65 8 14.14 5.5 10.65" />
              <path
                d="M8.73,12.27L8,13.28l-0.73-1L7.49,12.4,8,12.7l0.51-.3,
      0.22-.13M12.28,9L8,11.54,3.72,9,8,15l4.28-6h0Z"
              />
            </g>
            <path d="M8,2.94l2.9,4.81L8,9.44,5.1,7.75,8,2.94M8,1L3.72,8.11,8,10.6l4.28-2.49L8,1H8Z" />
          </g>
        );
    }
}
