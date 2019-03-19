import React from "react";

const Geth = React.forwardRef((props, ref) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" {...props} ref={ref}>
        <g fill="none" fillRule="evenodd" transform="translate(4)">
            <path d="M5.88235294,0.91390645 L0.659717096,8.90453929 L5.88235294,13.3437798 L11.1049888,8.90453929 L5.88235294,0.91390645 Z" />
            <polygon points="5.882 10 11.765 20 5.882 15 0 20" transform="matrix(1 0 0 -1 0 30)" />
        </g>
    </svg>
));
Geth.displayName = "Geth";
export default Geth;
