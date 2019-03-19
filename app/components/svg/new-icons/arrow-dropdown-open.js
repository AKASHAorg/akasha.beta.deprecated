import React from "react";

const ArrowDropdownOpen = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props} ref={ref}>
        <g fill="none" fillRule="evenodd" transform="rotate(90 3.75 9.25)" strokeLinecap="round">
            <path d="M0,0 L5,5" />
            <path d="M0,5 L5,10" transform="matrix(1 0 0 -1 0 15)" />
        </g>
    </svg>
));
ArrowDropdownOpen.displayName = "ArrowDropdownOpen";
export default ArrowDropdownOpen;
