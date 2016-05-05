import React from 'react';
import CircularProgress from './CicularProgress';
import { MenuEthereum } from '../svg';

function SyncProgress ({ innerIconStyle, value, strokeWidth }) {
  return (
    <CircularProgress mode={"determinate"} strokeWidth={strokeWidth} size={3} value={value} >
      <MenuEthereum style={innerIconStyle} />
    </CircularProgress>
  );
}
SyncProgress.propTypes = {
  innerIconStyle: React.PropTypes.object,
  strokeWidth: React.PropTypes.number,
  value: React.PropTypes.number
};

SyncProgress.defaultProps = {
  value: 1,
  strokeWidth: 1,
  innerIconStyle: { opacity: 0.6 }
};
export default SyncProgress;
