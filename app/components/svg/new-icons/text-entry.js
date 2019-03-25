import React from "react";

const TextEntry = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props} ref={ref}>
        <g fill="none" fillRule="evenodd" transform="translate(3 1)" strokeLinejoin="round">
            <polygon points="5 0 10 5 5 5" />
            <polygon points="0 14.059 0 0 5 0 5 5 10 5 10 14" strokeLinecap="round" />
        </g>
    </svg>
));
TextEntry.displayName = "TextEntry";
export default TextEntry;
