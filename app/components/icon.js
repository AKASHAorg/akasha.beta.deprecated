// @flow
import PropTypes from "prop-types";
import * as React from "react";
import classNames from "classnames";
import * as icons from "./svg/new-icons";

const Icon = React.forwardRef(({ className, ...props } /* : Object */, ref) => {
    const Component /* : React.Node */ = icons[props.type];
    const iconClass = classNames("icon", className);
    return <Component className={iconClass} {...props} ref={ref} />;
});

export default Icon;
