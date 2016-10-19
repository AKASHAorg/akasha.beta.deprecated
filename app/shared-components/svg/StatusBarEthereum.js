import React, { PropTypes } from 'react';

const StatusBarEthereum = (props, { muiTheme }) =>
  <g id="StatusBarEthereum-Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
    <polygon id="StatusBarEthereum-path-1" points="4.5 0 0 7.5 4.5 10.5 9 7.5" />
    <mask id="StatusBarEthereum-mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="9" height="10.5" fill="white">
      <use xlinkHref="#StatusBarEthereum-path-1" />
    </mask>
    <g id="StatusBarEthereum-16x16/Ethereum">
      <g id="Group" transform="translate(3.500000, 0.500000)">
        <use id="StatusBarEthereum-Path-18" stroke={muiTheme.palette.textColor} mask="url(#StatusBarEthereum-mask-2)" strokeWidth="2" xlinkHref="#StatusBarEthereum-path-1" />
        <polygon id="StatusBarEthereum-Path-18" fill={muiTheme.palette.textColor} points="4.5 11.5 0 8.5 4.5 15 9 8.5" />
      </g>
    </g>
  </g>;

StatusBarEthereum.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

export default StatusBarEthereum;
