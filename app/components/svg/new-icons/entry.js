import React from 'react';

const Entry = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" { ...props }
         ref={ ref }>
        <g fill="none" fillRule="evenodd" transform="translate(2 1)" strokeLinejoin="round">
            <polygon points="3.6 0 6 3 3.6 3"/>
            <polygon points="0 8 0 0 3.6 0 3.6 3 6 3 6 8" strokeLinecap="round"/>
        </g>
    </svg>
));
Entry.displayName = 'Entry';
export default Entry;
