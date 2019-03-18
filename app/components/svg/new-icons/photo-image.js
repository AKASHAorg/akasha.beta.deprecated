import React from "react";

const PhotoImage = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" {...props} ref={ref}>
        <g fill="none" fillRule="evenodd" transform="translate(2 2)">
            <polygon points="0 0 0 12 12 12 12 0" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M0.4,9.2 L11.6,9.2" strokeLinecap="square" />
            <polyline
                points="1.6 7.2 4 3.2 6.4 7.2 8 5.2 10.4 7.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </g>
    </svg>
));
PhotoImage.displayName = "PhotoImage";
export default PhotoImage;
