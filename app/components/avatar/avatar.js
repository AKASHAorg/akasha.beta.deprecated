import React from 'react';
import PropTypes from 'prop-types';
import { Avatar } from 'antd';
import { getInitials } from '../../utils/dataModule';

const AvatarPresenter = props => (
  <Avatar
    className={`avatar ${props.className}`}
    icon={(props.firstName || props.lastName) ? '' : 'user'}
    onClick={props.onClick}
    shape="square"
    size={props.size}
    src={props.image}
    style={{ cursor: props.onClick ? 'pointer' : 'default' }}
  >
    {(props.firstName || props.lastName) &&
        getInitials(props.firstName, props.lastName).toUpperCase()
    }
  </Avatar>
);

AvatarPresenter.propTypes = {
    className: PropTypes.string,
    image: PropTypes.string,
    size: PropTypes.oneOf(['large', 'standard', undefined, 'small']),
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    onClick: PropTypes.func,
};

AvatarPresenter.defaultProps = {
    size: 'standard' // 32X32px
};

export default AvatarPresenter;
