import React from "react";

const Comment = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" {...props} ref={ref}>
        <path
            fill="none"
            d="M7.05882353,0.285714286 L0.941176471,0.285714286 C0.579798319,0.285714286 0.285714286,0.578044339 0.285714286,0.937267153 L0.285714286,5.28095294 C0.285714286,5.64017575 0.579798319,5.93250581 0.941176471,5.93250581 L1.15966387,5.93250581 L1.15966387,7.71428571 L3.20820168,5.93250581 L7.05882353,5.93250581 C7.42020168,5.93250581 7.71428571,5.64017575 7.71428571,5.28095294 L7.71428571,0.937267153 C7.71428571,0.578044339 7.42020168,0.285714286 7.05882353,0.285714286 Z"
            transform="translate(1 1)"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
));

Comment.displayName = "Comment";

export default Comment;
