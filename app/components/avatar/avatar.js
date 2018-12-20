import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Link from 'react-router-dom/Link';
import { Avatar } from 'antd';
import { getInitials } from '../../utils/dataModule';
import { getBaseUrl } from '../../local-flux/selectors/index';

const AvatarPresenter = (props) => { // eslint-disable-line
    const { baseUrl, className, ethAddress, firstName, lastName, link, onClick, size } = props;
    let { image } = props;
    if (image && baseUrl && !image.includes(baseUrl)) {
        image = `${baseUrl}/${image}`;
    }
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
        if (!ethAddress) {
            console.error('Avatar with link should have ethAddress');
        }
        return (
          <Link to={`/${ethAddress}`}>
            {avatar}
          </Link>
        );
    }

    return avatar;
};

AvatarPresenter.propTypes = {
    baseUrl: PropTypes.string,
    className: PropTypes.string,
    ethAddress: PropTypes.string,
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

function mapStateToProps (state) {
    return {
        baseUrl: getBaseUrl(state)
    };
}

export default connect(mapStateToProps)(AvatarPresenter);
