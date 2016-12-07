import React, { PropTypes, Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuEntries } from '../svg';


class IconEntries extends Component {

  _handleClick = (ev) => {
    if(this.props.onClick) return this.props.onClick(ev);
  }

  render () {
    let { style, iconStyle, viewBox, hoverColor, color, disabled, tooltip, ...other } = this.props;
    const { palette } = this.context.muiTheme;

    style = Object.assign(style, {
        borderColor: colors.faintBlack,
        ':hover': {
            borderColor: palette.primary1Color
        }
      }
    );

    return (
      <CircleIcon
        style={style}
        disabled = {disabled}
        tooltip = {tooltip}
        onClick = {this._handleClick}
      >
        <SvgIcon
          color={color}
          hoverColor={hoverColor}
          style={iconStyle}
          viewBox={viewBox}
          onClick={this._handleClick}
          {...other}
        >
          <MenuEntries />
        </SvgIcon>
      </CircleIcon>
    );
  }
}

IconEntries.propTypes = {
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    viewBox: PropTypes.string,
    hoverColor: PropTypes.string,
    color: PropTypes.string
};

IconEntries.defaultProps = {
    style: {
        width: '32px',
        height: '32px',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderRadius: '50%'
    },
    viewBox: '0 0 32 32',
    color: colors.lightBlack,
    hoverColor: colors.darkBlack
};

IconEntries.contextTypes = {
    muiTheme: React.PropTypes.object
};

export default IconEntries;
