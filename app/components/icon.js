// @flow
import * as React from 'react';
import classNames from 'classnames';
import * as icons from './svg/new-icons';

const Icon /* : React.AbstractComponent<any> */ = React.forwardRef((
    { className, ...props } /*: Object */,
    ref
) => {
    const Component /*: React.AbstractComponent<any> */ = icons[props.type];
    const iconClass = classNames('icon', className);
    return <Component className={iconClass} {...props} ref={ref} />;
});

Icon.displayName = 'Icon';

export default Icon;
