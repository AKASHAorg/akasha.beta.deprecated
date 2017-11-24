import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import * as icons from './svg/new-icons';

const Icon = ({ className, ...props }) => {
    const Component = icons[props.type];
    const iconClass = classNames('icon', className);
    return <Component className={iconClass} {...props} />;
};

Icon.propTypes = {
    className: PropTypes.string,
    type: PropTypes.string.isRequired,
};

export default Icon;
