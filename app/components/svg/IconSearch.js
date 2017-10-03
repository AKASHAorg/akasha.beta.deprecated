import PropTypes from 'prop-types';
import React from 'react';
import CircleIcon from './CircleIcon';
import { MenuSearch } from '../svg';

const IconSearch = (props) => {
    const { disabled, iconStyle, isActive, onClick } = props;
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
          <MenuSearch />
        </svg>
      </CircleIcon>
    );
};

IconSearch.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func
};

export default IconSearch;
