import React, { PropTypes, Component } from 'react';
import SvgIcon from 'material-ui/lib/svg-icon';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import Colors from 'material-ui/lib/styles/colors';
import CircleIcon from './CircleIcon';

import {MenuUser} from '../svg';
import './styles/sidebar.scss';


export default class IconProfile extends Component {

  state = {
    muiTheme: this.context.muiTheme || getMuiTheme()
  };

  static propTypes = {
    style:      PropTypes.object,
    iconStyle:  PropTypes.object,
    viewBox:    PropTypes.string,
    hoverColor: PropTypes.string,
    color: PropTypes.string
  };

  static defaultProps = {
    style:      {
      transform:    'scale(1.2)',
      width:        '34px',
      height:       '34px',
      borderWidth:       '1px',
      borderStyle: 'solid',
      borderRadius: '50%'
    },
    iconStyle:  {width: '32px', height: '32px', transform: 'scale(0.9)', visibility: 'visible'},
    viewBox:    '0 0 32 32',
    color: Colors.lightBlack,
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
    const {style, iconStyle, viewBox, hoverColor, color, ...other} = this.props;
    const {
            baseTheme: {
              palette
              }
            } = this.state.muiTheme;

    return (
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
    )
  }

}
