import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ChatSidebar from './chat-sidebar';

class ChatPage extends Component {
    componentWillReceiveProps (nextProps) {
        const { recentChannels, shouldNavigateToChannel } = nextProps;
        if (shouldNavigateToChannel && !this.props.shouldNavigateToChannel) {
            this.navigateToChannel(recentChannels.first());
        }
    }

    joinChannel = (channel) => {
        const { chatActions } = this.props;
        chatActions.saveChannel(channel);
    };

    leaveChannel = (channel) => {
        const { chatActions } = this.props;
        chatActions.deleteChannel(channel);
    };

    navigateToChannel = (channel) => {
        const { loggedProfileAkashaId, params } = this.props;
        if (params.channel !== channel) {
            this.context.router.push(`${loggedProfileAkashaId}/chat/channel/${channel}`);
        }
    };

    render () {
        const { activeChannel, chatActions, children, joinedChannels, loggedProfileAddress,
            loggedProfileAkashaId, loggedProfileAvatar, loggedProfileInitials,
            recentChannels } = this.props;
        const { palette } = this.context.muiTheme;

        return (
          <div style={{ height: '100%', color: palette.textColor }}>
            {React.cloneElement(children, {
                activeChannel,
                chatActions,
                defaultChannel: joinedChannels.first(),
                joinedChannels,
                loggedProfileAddress,
                loggedProfileAkashaId,
                loggedProfileAvatar,
                loggedProfileInitials,
                navigateToChannel: this.navigateToChannel,
            })}
            <ChatSidebar
              activeChannel={activeChannel}
              deleteRecentChannel={chatActions.deleteRecentChannel}
              joinChannel={this.joinChannel}
              joinedChannels={joinedChannels}
              leaveChannel={this.leaveChannel}
              navigateToChannel={this.navigateToChannel}
              recentChannels={recentChannels}
            />
          </div>
        );
    }
}

ChatPage.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

ChatPage.propTypes = {
    activeChannel: PropTypes.string,
    chatActions: PropTypes.shape(),
    children: PropTypes.element,
    joinedChannels: PropTypes.shape(),
    loggedProfileAddress: PropTypes.string,
    loggedProfileAkashaId: PropTypes.string,
    loggedProfileAvatar: PropTypes.string,
    loggedProfileInitials: PropTypes.string,
    params: PropTypes.shape(),
    recentChannels: PropTypes.shape(),
    shouldNavigateToChannel: PropTypes.bool
};

export default ChatPage;
