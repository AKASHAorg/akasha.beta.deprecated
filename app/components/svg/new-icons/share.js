import React from 'react';

const Share = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" { ...props }
         ref={ ref }>
        <g fill="none" fillRule="evenodd" transform="translate(1 1)">
            <circle cx="6.571" cy="1.429" r="1.429"/>
            <circle cx="6.571" cy="6.571" r="1.429"/>
            <circle cx="1.429" cy="3.714" r="1.429"/>
            <path
                d="M5.14285714 2L2.85714286 3.14285714M2.57142857 4.57142857L4.85714286 6.28571429"
                strokeLinecap="square"
            />
        </g>
    </svg>
));
Share.displayName = 'Share';

export default Share;
