import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CircleIcon from './CircleIcon';
import { MenuChat } from '../svg';

class IconChat extends Component {
    render () {
        const { isActive, onClick } = this.props;

        return (
          <CircleIcon
            isActive={isActive}
            onClick={onClick}
            iconStyle={{ width: '32px', height: '32px' }}
          >
            <svg
              viewBox="0 0 32 32"
            >
              <MenuChat />
            </svg>
          </CircleIcon>
        );
    }
}

IconChat.propTypes = {
    isActive: PropTypes.bool,
    onClick: PropTypes.func,
};

export default IconChat;
