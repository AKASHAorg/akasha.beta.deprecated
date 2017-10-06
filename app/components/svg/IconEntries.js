import PropTypes from 'prop-types';
import React from 'react';
import CircleIcon from './CircleIcon';
import { MenuEntries } from '../svg';

const IconEntries = (props) => {
    const { disabled, iconStyle, isActive } = props;

    return (
      <CircleIcon
        disabled={disabled}
        isActive={isActive}
      >
        <svg
          style={iconStyle}
          viewBox="0 0 32 32"
        >
          <MenuEntries />
        </svg>
      </CircleIcon>
    );
};

IconEntries.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
};

export default IconEntries;
