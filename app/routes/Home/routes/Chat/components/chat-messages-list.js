import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DataLoader } from '../../../../../components';
import ChatMessage from './chat-message';

class ChatMessagesList extends Component {
    shouldComponentUpdate (nextProps) {
        if (!nextProps.messages.equals(this.props.messages) ||
                nextProps.loadingData !== this.props.loadingData) {
            return true;
        }
        return false;
    }

    render () {
        const { loadingData, loggedProfileAkashaId, messages, navigateToChannel,
            onAuthorClick } = this.props;
        if (loadingData) {
            return <DataLoader flag style={{ paddingTop: '100px' }} />;
        }
        return (
          <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                minHeight: '100%',
                padding: '0 30px'
            }}
          >
            {messages.map(data =>
              (<ChatMessage
                key={data.messageHash}
                isOwnMessage={loggedProfileAkashaId === data.akashaId}
                data={data}
                navigateToChannel={navigateToChannel}
                onAuthorClick={onAuthorClick}
              />)
            )}
          </div>
        );
    }
}

ChatMessagesList.propTypes = {
    loadingData: PropTypes.bool,
    loggedProfileAkashaId: PropTypes.string,
    messages: PropTypes.shape(),
    navigateToChannel: PropTypes.func,
    onAuthorClick: PropTypes.func,
};

export default ChatMessagesList;
