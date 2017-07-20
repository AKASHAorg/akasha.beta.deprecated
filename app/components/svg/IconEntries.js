import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuEntries } from '../svg';

class IconEntries extends Component {
    render () {
        const { disabled, iconStyle, isActive, onClick } = this.props;

        return (
          <CircleIcon
            disabled={disabled}
            isActive={isActive}
            // onClick={onClick}
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
    }
}

IconEntries.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    // onClick: PropTypes.func,
};

export default IconEntries;
