import React, { Component } from 'react';
import { Link } from 'react-router';
import SyncProgress from './ui/loaders/SyncProgress';
import {MenuEthereum, MenuAkashaLogo} from './ui/icons';
import ProfileBadge from './ui/ProfileBadge';
import SvgIcon from 'material-ui/lib/svg-icon';

export default class Home extends Component {
  render () {
    return (
      <div>
        <div>
          <h2>Homeaa</h2>
          <Link to="/counter">to Counters</Link>
          <SyncProgress value={12} />
          <ProfileBadge />
          <SvgIcon>
          <MenuAkashaLogo />
          </SvgIcon>
        </div>
      </div>
    );
  }
}
