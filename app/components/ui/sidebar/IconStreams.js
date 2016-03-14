import React, { PropTypes, Component } from 'react';
import SvgIcon from 'material-ui/lib/svg-icon';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import * as Colors from 'material-ui/lib/styles/colors';
import CircleIcon from './CircleIcon';
import {MenuStreams} from '../svg';


export default class IconStreams extends Component {
  state = {
    muiTheme: this.context.muiTheme || getMuiTheme()
  };

  static propTypes = {
    style:      PropTypes.object,
    iconStyle:  PropTypes.object,
    viewBox:    PropTypes.string,
    hoverColor: PropTypes.string,
    color:      PropTypes.string
  };

  static defaultProps = {
    style:      {
      width:        '32px',
      height:       '32px',
      borderWidth:  '1px',
      borderStyle:  'solid',
      borderRadius: '50%'
    },
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
    let {style, iconStyle, viewBox, hoverColor, color, ...other} = this.props;
    const {
          baseTheme: {
            palette
            }
          } = this.state.muiTheme;

    style = Object.assign(style, {
        borderColor: Colors.faintBlack,
        ':hover':    {
          borderColor: palette.primary1Color
        }
      }
    );

    return (
      <CircleIcon
        style={style}
      >
        <SvgIcon
          color={color}
          hoverColor={hoverColor}
          style={iconStyle}
          viewBox={viewBox}
          {...other}
        >
          <MenuStreams />
        </SvgIcon>
      </CircleIcon>
    )
  }
}
