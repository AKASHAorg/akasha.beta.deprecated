import React, { PropTypes, Component } from 'react';
import SvgIcon from 'material-ui/lib/svg-icon';

import {MenuAddEntry, MenuAkashaLogo, MenuCommunities, MenuEntries, MenuEthereum,
  MenuPeople, MenuPortals, MenuSearch, MenuStreams, MenuUser} from '../svg';

import Profile from './IconProfile';
import AddEntry from './IconAddEntry';
import Search from './IconSearch';
import Streams from './IconStreams';
import Portals from './IconPortals';
import Community from './IconCommunity';
import People from './IconPeople';
import Logo from './IconLogo';

export default class SideBar extends Component {

  static propTypes = {
    style:      PropTypes.object,
    iconStyle:  PropTypes.object,
    innerStyle: PropTypes.object,
    viewBox:    PropTypes.string,
    color:      PropTypes.string
  };

  static defaultProps = {
    style:     {
      height:          '100%',
      padding:         '0',
      display:         'flex',
      flexDirection:   'column',
      position:        'relative',
      backgroundColor: '#f3f3f3',
      borderRight:     '1px solid #cccccc',
      width:           '64px'
    },
    iconStyle: {
      width:  '32px',
      height: '32px'
    },

    viewBox: '0 0 32 32',
    color:   '#000'
  };

  render () {
    let {style, iconStyle, innerStyle, ...other} = this.props;

    return (
      <div style={style}>
        <div style={{flexGrow: 1, padding: '16px'}}>
          <Profile />
        </div>
        <div style={{flexGrow: 1, padding: '16px'}}>
          <AddEntry />
          <Search />
        </div>
        <div style={{flexGrow: 4, padding: '16px'}}>
          <Streams />
          <Portals />
          <Community />
          <People />
        </div>
        <div style={{flexGrow: 1, padding: '16px'}}>
          <Logo style={{position:'absolute', bottom: '16px', width: '32px', height: '32px'}}/>
        </div>
      </div>
    );

  }
}
