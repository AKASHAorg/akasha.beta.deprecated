import React, { PropTypes } from 'react';
import CircularProgress from './circular-progress';
import { MenuEthereum } from '../svg';

function SyncProgress ({ innerIconStyle, value, strokeWidth }, { muiTheme }) {
    const defaultIconStyle = {
        fill: muiTheme.palette.textColor
    };
    return (
        <CircularProgress mode="determinate" strokeWidth={strokeWidth} size={3} value={value} >
            <MenuEthereum style={innerIconStyle || defaultIconStyle} />
        </CircularProgress>
    );
}
SyncProgress.propTypes = {
    innerIconStyle: PropTypes.object,
    strokeWidth: PropTypes.number,
    value: PropTypes.number
};

SyncProgress.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
}

SyncProgress.defaultProps = {
    value: 1,
    strokeWidth: 1
};
export default SyncProgress;
