import React from 'react';

const Highlight = props => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props}>
    <g fill="none" fillRule="evenodd" transform="translate(2 2)">
      <path d="M10.5,0 L10.5,12.5384048" strokeLinecap="round" strokeLinejoin="round" />
      <g transform="translate(.5)">
        <rect width="5" height="5" x="3.5" y=".5" rx=".5" />
        <path d="M5.5,6.16666667 L2.75,2.5 L0.5,2.5 L0.5,7.5 L5.5,7.5 L5.5,6.16666667 Z" />
      </g>
    </g>
  </svg>
);

export default Highlight;
