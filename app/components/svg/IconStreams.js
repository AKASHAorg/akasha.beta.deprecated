import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CircleIcon from './CircleIcon';
import { MenuStreams } from '../svg';


class IconStreams extends Component {

    render () {
        const { disabled, iconStyle, isActive, onClick } = this.props;

        return (
          <CircleIcon
            disabled={disabled}
            isActive={isActive}
            onClick={onClick}
          >
            <svg
              style={iconStyle}
              viewBox="0 0 32 32"
            >
              <MenuStreams />
            </svg>
          </CircleIcon>
        );
    }
}

IconStreams.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default IconStreams;
