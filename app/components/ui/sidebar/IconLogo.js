import React, { PropTypes, Component } from 'react';
import SvgIcon from 'material-ui/lib/svg-icon';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import Colors from 'material-ui/lib/styles/colors';
import {MenuAkashaLogo} from '../svg';
import Radium from 'radium';

class IconLogo extends Component {
  state = {
    muiTheme: this.context.muiTheme || getMuiTheme()
  };

  static propTypes = {
    iconStyle:  PropTypes.object,
    viewBox:    PropTypes.string,
    hoverColor: PropTypes.string,
    color:      PropTypes.string
  };

  static defaultProps = {
    iconStyle:  {width: '32px', height: '32px'},
    viewBox:    '0 0 32 32',
    color:      Colors.lightBlack,
    hoverColor: Colors.darkBlack
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
    let {iconStyle, viewBox, hoverColor, color, ...other} = this.props;
    return (
        <SvgIcon
          color={color}
          className={'hand-icon'}
          hoverColor={hoverColor}
          style={iconStyle}
          viewBox={viewBox}
          {...other}
        >
          <MenuAkashaLogo />
        </SvgIcon>
    )
  }
}
export default Radium(IconLogo);
