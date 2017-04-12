import React, { PropTypes, Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuPortals } from '../svg';


export default class IconPortals extends Component {
    _handleClick = (ev) => {
        if (this.props.onClick) return this.props.onClick(ev);
        return false;
    }
    render () {
        let {
            style,
            iconStyle,
            viewBox,
            hoverColor,
            color,
            disabled,
            tooltip,
            ...other } = this.props;
        const {
          baseTheme: {
            palette
          }
        } = this.context.muiTheme;
        style = Object.assign(style, {
            ':hover': {
                borderColor: palette.primary1Color
            }
        });

        return (
          <CircleIcon
            disabled={disabled}
            tooltip={tooltip}
            onClick={this._handleClick}
          >
            <SvgIcon
              color={color}
              hoverColor={hoverColor}
              viewBox={viewBox}
              {...other}
            >
              <MenuPortals />
            </SvgIcon>
          </CircleIcon>
        );
    }
}

IconPortals.propTypes = {
    style: PropTypes.object,
    viewBox: PropTypes.string,
    hoverColor: PropTypes.string,
    color: PropTypes.string,
    iconStyle: PropTypes.object,
    disabled: PropTypes.bool,
    tooltip: PropTypes.string
};
IconPortals.defaultProps = {
    style: {
        borderRadius: '50%'
    },
    viewBox: '0 0 32 32',
    color: colors.lightBlack,
    hoverColor: colors.darkBlack
};
IconPortals.contextTypes = {
    muiTheme: React.PropTypes.object
};
