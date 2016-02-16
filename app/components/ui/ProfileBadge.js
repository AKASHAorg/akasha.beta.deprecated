import Badge from 'material-ui/lib/badge';
import React, { Component } from 'react';
import CircularProgress from './loaders/CicularProgress';
import {MenuUser} from './svg';

export default class ProfileBadge extends Component {
  render () {
    return (
      <Badge
        badgeContent={1}
        badgeStyle={{backgroundColor: 'red', fontSize:8, width: '14px', height: '14px', top:7, right:7}}
      >
        <CircularProgress mode={"determinate"}>
          <MenuUser />
        </CircularProgress>
      </Badge>
    )
  }
}
