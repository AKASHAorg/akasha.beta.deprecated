import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CircleIcon from './CircleIcon';
import { MenuAddEntry } from '../svg';

class IconAddEntry extends Component {
    render () {
        const { iconStyle, disabled, tooltip, isActive, onClick } = this.props;

        return (
          <CircleIcon
            disabled={disabled}
            isActive={isActive}
            onClick={onClick}
            tooltip={tooltip}
          >
            <svg
              style={iconStyle}
              viewBox="0 0 32 32"
            >
              <MenuAddEntry />
            </svg>
          </CircleIcon>
        );
    }
}

IconAddEntry.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
    tooltip: PropTypes.string,
};

export default IconAddEntry;
