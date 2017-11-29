import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { Icon } from './';

const SidebarIcon = (props) => {
    const { activePath, iconType, linkTo, location } = props;
    const isActive = location.pathname.includes(activePath);
    const wrapperClassName = classNames('flex-center sidebar-icon__wrapper', {
        'sidebar-icon__wrapper_active': isActive,
    });
    const iconClassName = classNames('sidebar-icon__icon', {
        'sidebar-icon__icon_active': isActive
    });

    return (
      <Link to={linkTo || ''}>
        <div className={wrapperClassName}>
          <Icon className={iconClassName} type={iconType} />
        </div>
      </Link>
    );
};

SidebarIcon.propTypes = {
    activePath: PropTypes.string.isRequired,
    iconType: PropTypes.string.isRequired,
    linkTo: PropTypes.string,
    location: PropTypes.shape().isRequired,
};

export default withRouter(SidebarIcon);
