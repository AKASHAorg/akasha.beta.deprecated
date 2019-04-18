import React from 'react';

const Search = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" { ...props }
         ref={ ref }>
        <g fill="none" fillRule="evenodd" transform="translate(2 2)">
            <circle cx="4.588" cy="4.588" r="4.588"/>
            <path d="M12,12 L7.929069,7.929069" strokeLinecap="round"/>
        </g>
    </svg>
));
Search.displayName = 'Search';
export default Search;
