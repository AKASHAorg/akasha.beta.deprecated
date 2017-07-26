import PropTypes from 'prop-types';
import React from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuEntries } from '../svg';

const IconEntries = (props) => {
    const { disabled, iconStyle, isActive } = props;

    return (
      <CircleIcon
        disabled={disabled}
        isActive={isActive}
      >
        <SvgIcon
          color={colors.lightBlack}
          hoverColor={colors.darkBlack}
          style={iconStyle}
          viewBox="0 0 32 32"
        >
          <MenuEntries />
        </SvgIcon>
      </CircleIcon>
    );
};

IconEntries.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
};

export default IconEntries;
