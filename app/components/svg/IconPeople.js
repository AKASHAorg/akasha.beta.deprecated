import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuPeople } from '../svg';


class IconEntries extends Component {
    // static defaultProps = {
    //     iconStyle: { width: '32px', height: '32px' },
    // };


    render () {
        let { disabled, iconStyle, isActive, onClick } = this.props;

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
    }
}

IconEntries.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default IconEntries;
