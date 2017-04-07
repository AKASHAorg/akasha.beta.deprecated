import React, { PropTypes, Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import ChatIcon from 'material-ui/svg-icons/communication/chat-bubble-outline';
import { MenuChat } from '../svg';

class IconChat extends Component {

    render () {
        let { isActive, onClick } = this.props;

        return (
          <CircleIcon
            isActive={isActive}
            onClick={onClick}
            iconStyle={{ width: '32px', height: '32px' }}
          >
            <SvgIcon
              viewBox="0 0 32 32"
            >
              <MenuChat />
            </SvgIcon>
          </CircleIcon>
        );
    }
}

IconChat.propTypes = {
    disabled: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    isActive: PropTypes.bool,
    onClick: PropTypes.func.isRequired,
};

export default IconChat;
