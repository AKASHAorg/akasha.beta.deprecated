import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Avatar } from 'antd';
import { getInitials } from '../../utils/dataModule';

const AvatarPresenter = (props) => {
    const { akashaId, className, firstName, image, lastName, link, onClick, size } = props;
    const initials = !image && (firstName || lastName) && getInitials(firstName, lastName).toUpperCase();
    const sizes = { small: 'sm', standard: 'base', large: 'lg' };
    const base = 'avatar_with-initials';
    const avatar = initials ?
      (<div
        className={`avatar ${base} ${base}_${sizes[size]} ${className || ''}`}
        onClick={onClick}
        style={{ cursor: onClick || link ? 'pointer' : 'default' }}
      >
        {initials &&
          <div
            className="flex-center"
            style={{ cursor: onClick || link ? 'pointer' : 'default' }}
          >
            {initials}
          </div>
        }
      </div>) :
      (<Avatar
        className={`avatar ${className || ''}`}
        icon={'user'}
        onClick={onClick}
        shape="square"
        size={size}
        src={image && image}
        style={{ cursor: onClick || link ? 'pointer' : 'default' }}
      />);

    if (link) {
        return (
          <Link to={{ pathname: `/@${akashaId}`, state: { overlay: true } }}>
            {avatar}
          </Link>
        );
    }

    return avatar;
};

AvatarPresenter.propTypes = {
    akashaId: PropTypes.string,
    className: PropTypes.string,
    firstName: PropTypes.string,
    image: PropTypes.string,
    lastName: PropTypes.string,
    link: PropTypes.bool,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['large', 'standard', 'small']),
};

AvatarPresenter.defaultProps = {
    size: 'standard' // 32X32px
};

export default AvatarPresenter;
