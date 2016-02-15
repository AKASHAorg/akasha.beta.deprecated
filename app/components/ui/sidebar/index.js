import React, { PropTypes, Component } from 'react';
import SvgIcon from 'material-ui/lib/svg-icon';

import {MenuAddEntry, MenuAkashaLogo, MenuCommunities, MenuEntries, MenuEthereum,
  MenuPeople, MenuPortals, MenuSearch, MenuStreams, MenuUser} from '../icons';


export default class SideBar extends Component {

  static propTypes = {
    style:      PropTypes.object,
    iconStyle:  PropTypes.object,
    innerStyle: PropTypes.object,
    viewBox:    PropTypes.string,
    color:      PropTypes.string
  };

  static defaultProps = {
    style:      {
      height:          '100%',
      padding:         '0',
      display:         'flex',
      flexDirection:   'column',
      position:        'relative',
      backgroundColor: '#f3f3f3',
      borderRight:     '1px solid #cccccc',
      width:           '64px'
    },
    iconStyle:  {
      width:  '32px',
      height: '32px'
    },
    innerStyle: {
      flex:    1,
      padding: '16px'
    },
    viewBox:    '0 0 32 32',
    color:      '#000'
  };

  render () {
    let {style, iconStyle, innerStyle, ...other} = this.props;

    return (
      <div style={style}>
        <div style={innerStyle}>
          <SvgIcon style={iconStyle} {...other}>
            <MenuAddEntry />
          </SvgIcon>
        </div>
        <div style={innerStyle}>
          <SvgIcon style={iconStyle} {...other}>
            <MenuAddEntry />
          </SvgIcon>
        </div>
        <div style={innerStyle}>
          <SvgIcon style={iconStyle} {...other}>
            <MenuAddEntry />
          </SvgIcon>
        </div>
        <div style={innerStyle}>
          <SvgIcon style={iconStyle} {...other}>
            <MenuAddEntry />
          </SvgIcon>
        </div>
        <div style={innerStyle}>
          <SvgIcon style={iconStyle} {...other}>
            <MenuAddEntry />
          </SvgIcon>
        </div>
        <div style={innerStyle}>
          <SvgIcon style={iconStyle} {...other}>
            <MenuAddEntry />
          </SvgIcon>
        </div>
        <div style={innerStyle}>
          <SvgIcon style={iconStyle} {...other}>
            <MenuAddEntry />
          </SvgIcon>
        </div>
        <div style={innerStyle}>
          <SvgIcon style={iconStyle} {...other}>
            <MenuAddEntry />
          </SvgIcon>
        </div>
      </div>
    );

  }

}
