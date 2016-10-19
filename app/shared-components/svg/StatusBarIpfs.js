import React, { PropTypes } from 'react';

const StatusBarIpfs = (props, { muiTheme }) =>
  <g id="StatusBarIpfs-Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <defs>
      <polygon id="StatusBarIpfs-polygon" points="1.5 4.5 8 0.5 14.5 4.5 14.5 11.5 8 15.5 1.5 11.5"></polygon>
      <mask id="StatusBarIpfs-mask" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="13" height="15" fill="white">
        <use xlinkHref="#StatusBarIpfs-polygon"></use>
      </mask>
    </defs>
    <g id="StatusBarEthereum-16x16/IPFS" stroke={muiTheme.palette.textColor}>
      <path d="M8,8.5 L8,14.5" id="StatusBarIpfs-Path-21"></path>
      <use id="StatusBarIpfs-Path-19" mask="url(#StatusBarIpfs-mask)" strokeWidth="2" xlinkHref="#StatusBarIpfs-polygon"></use>
      <polyline id="StatusBarIpfs-Path-20" points="2.5 5 8 8.5 13.5 5"></polyline>
    </g>
  </g>;

StatusBarIpfs.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

export default StatusBarIpfs;
