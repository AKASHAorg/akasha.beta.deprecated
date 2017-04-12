import React, { PropTypes, Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuPeople } from '../svg';


class IconPeople extends Component {
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

IconPeople.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default IconPeople;
