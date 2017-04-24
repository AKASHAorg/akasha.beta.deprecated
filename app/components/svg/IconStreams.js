import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuStreams } from '../svg';


class IconStreams extends Component {

    render () {
        let { disabled, iconStyle, isActive, onClick } = this.props;

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
              <MenuStreams />
            </SvgIcon>
          </CircleIcon>
        );
    }
}

IconStreams.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.object,
    isActive: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default IconStreams;
