import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { Avatar } from 'antd';
import { getInitials } from '../../utils/dataModule';

const AvatarPresenter = (props) => {
    const { akashaId, className, firstName, history, image, lastName, link, onClick, size } = props;
    const clickHandler = (ev) => {
        if (link && akashaId) {
            history.push(`/@${akashaId}`);
        }
        if (onClick) {
            onClick(ev);
        }
    };

    return (
      <Avatar
        className={`avatar ${className}`}
        icon={(firstName || lastName) ? '' : 'user'}
        onClick={clickHandler}
        shape="square"
        size={size}
        src={image}
        style={{ cursor: onClick || link ? 'pointer' : 'inherit' }}
      >
        {!image && (firstName || lastName) &&
            getInitials(firstName, lastName).toUpperCase()
        }
      </Avatar>
    );
};

AvatarPresenter.propTypes = {
    akashaId: PropTypes.string,
    className: PropTypes.string,
    firstName: PropTypes.string,
    history: PropTypes.shape().isRequired,
    image: PropTypes.string,
    lastName: PropTypes.string,
    link: PropTypes.bool,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['large', 'standard', 'small']),
};

AvatarPresenter.defaultProps = {
    size: 'standard' // 32X32px
};

export default withRouter(AvatarPresenter);
