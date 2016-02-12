import React, { Component } from 'react';
import CircularProgress from './CicularProgress';
import {MenuEthereum} from '../icons';

export default class SyncProgress extends Component {
  static propTypes = {
    innerIconStyle: React.PropTypes.object,
    strokeWidth:    React.PropTypes.number,
    value:          React.PropTypes.number
  };

  static defaultProps = {
    value:          1,
    strokeWidth:    1.2,
    innerIconStyle: {opacity: 0.54}
  };

  render () {
    let {innerIconStyle, value, strokeWidth} = this.props;

    return (
      <CircularProgress mode={"determinate"}
                        strokeWidth={strokeWidth}
                        value={value}>

        <MenuEthereum style={innerIconStyle}/>

      </CircularProgress>
    );
  }
}
