import React, { Component, PropTypes } from 'react';
import { DataLoader } from 'shared-components';
import ChatMessage from './ChatMessage';

class ChatMessagesList extends Component {
    shouldComponentUpdate (nextProps) {
        if (!nextProps.messages.equals(this.props.messages) ||
                nextProps.loadingData !== this.props.loadingData) {
            return true;
        }
        return false;
    }

    render () {
        const { loadingData, loggedProfileAkashaId, messages, onAuthorClick } = this.props;
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
              <ChatMessage
                key={data.messageHash}
                isOwnMessage={loggedProfileAkashaId === data.akashaId}
                data={data}
                onAuthorClick={onAuthorClick}
              />
            )}
          </div>
        );
    };
}

ChatMessagesList.propTypes = {
    loadingData: PropTypes.bool,
    loggedProfileAkashaId: PropTypes.string,
    messages: PropTypes.shape(),
    onAuthorClick: PropTypes.func
};

export default ChatMessagesList;