import PropTypes from 'prop-types';
import React from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
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
        <SvgIcon
          color={colors.lightBlack}
          hoverColor={colors.darkBlack}
          style={iconStyle}
          viewBox="0 0 32 32"
        >
          <MenuSearch />
        </SvgIcon>
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
