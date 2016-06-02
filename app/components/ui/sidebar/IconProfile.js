import React, { PropTypes, Component } from 'react';
import { SvgIcon, Badge } from 'material-ui';
import { colors } from 'material-ui/styles';
import { MenuUser } from '../svg';


export default class IconProfile extends Component {

  state = {
    muiTheme: this.context.muiTheme
  };

  static propTypes = {
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    viewBox: PropTypes.string,
    hoverColor: PropTypes.string,
    color: PropTypes.string
  };

  static defaultProps = {
    style: {
      transform: 'scale(1.2)',
      width: '34px',
      height: '34px',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderRadius: '50%'
    },
    iconStyle: { width: '32px', height: '32px', transform: 'scale(0.9)', visibility: 'visible' },
    viewBox: '0 0 32 32',
    color: colors.lightBlack,
    hoverColor: colors.darkBlack
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static childContextTypes = {
    muiTheme: React.PropTypes.object
  };

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme
    };
  }

  render () {
    const { style, iconStyle, viewBox, hoverColor, color, ...other } = this.props;
    const {
      baseTheme: {
        palette
      }
    } = this.state.muiTheme;

    return (
      <Badge
        badgeContent={1}
        badgeStyle={{
        top:'-4px',
        right: '-4px',
        fontSize: '10px',
        width: '18px',
        height: '18px',
        backgroundColor: colors.red500
      }}
        primary={true}
        style={{padding:0}}
      >
        <div
          style={Object.assign(style, {borderColor:  palette.primary1Color})}
          className="user-icon"
        >
          <SvgIcon
            color={color}
            hoverColor={hoverColor}
            style={iconStyle}
            viewBox={viewBox}
            {...other}
          >
            <MenuUser />
          </SvgIcon>
        </div>
      </Badge>
    )
  }

}
