import PropTypes from 'prop-types';
import React from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuPeople } from '../svg';


const IconPeople = (props) => {
    const { iconStyle, isActive, onClick } = props;

    return (
      <CircleIcon
        isActive={isActive}
        onClick={onClick}
      >
        <SvgIcon
          color={colors.lightBlack}
          hoverColor={colors.darkBlack}
          style={iconStyle}
          viewBox="0 0 32 32"
        >
          <MenuPeople />
        </SvgIcon>
      </CircleIcon>
    );
};

IconPeople.propTypes = {
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default IconPeople;
