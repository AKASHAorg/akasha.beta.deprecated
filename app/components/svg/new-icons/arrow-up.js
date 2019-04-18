import React from 'react';

const ArrowUp = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" { ...props }
         ref={ ref }>
        <g fill="none" fillRule="evenodd" transform="rotate(-90 8.5 5.5)" strokeLinecap="round">
            <path d="M7,0 L12,5"/>
            <path d="M7,5 L12,10" transform="matrix(1 0 0 -1 0 15)"/>
            <path d="M0,5 L12,5"/>
        </g>
    </svg>
));

ArrowUp.displayName = 'ArrowUp';

export default ArrowUp;
