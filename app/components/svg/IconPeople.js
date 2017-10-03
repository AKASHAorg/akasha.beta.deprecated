import PropTypes from 'prop-types';
import React from 'react';
import CircleIcon from './CircleIcon';
import { MenuPeople } from '../svg';


const IconPeople = (props) => {
    const { iconStyle, isActive, onClick } = props;

    return (
      <CircleIcon
        isActive={isActive}
        onClick={onClick}
      >
        <svg
          style={iconStyle}
          viewBox="0 0 32 32"
        >
          <MenuPeople />
        </svg>
      </CircleIcon>
    );
};

IconPeople.propTypes = {
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default IconPeople;
