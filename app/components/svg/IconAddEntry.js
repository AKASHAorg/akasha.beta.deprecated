import React, { PropTypes, Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuAddEntry } from '../svg';

class IconAddEntry extends Component {
    render () {
        let { iconStyle, viewBox, disabled, tooltip, isActive, onClick } = this.props;

        return (
          <CircleIcon
            disabled={disabled}
            isActive={isActive}
            onClick={onClick}
            tooltip={tooltip}
          >
            <SvgIcon
              color={colors.lightBlack}
              hoverColor={colors.darkBlack}
              style={iconStyle}
              viewBox="0 0 32 32"
            >
              <MenuAddEntry />
            </SvgIcon>
          </CircleIcon>
        );
    }
}

IconAddEntry.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
    tooltip: PropTypes.string,
};

export default IconAddEntry;
