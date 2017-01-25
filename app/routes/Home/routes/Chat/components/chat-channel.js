import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { IconButton, SvgIcon, TextField } from 'material-ui';
import { chatMessages } from 'locale-data/messages';
import { Avatar } from 'shared-components';
import { EntryBookmarkOn, EntryBookmarkOff } from 'shared-components/svg';
import { List } from 'immutable';
import ChatMessagesList from './chat-messages-list';

const CHARACTER_LIMIT = 128;

class ChatChannel extends Component {
    constructor (props) {
        super(props);
        this.chatInput = null;
        this.messagesContainer = null;
        this.timeout = null;
        this.state = {
            currentMessage: '',
            inputFocused: null,
            isScrollable: false,
            loadingData: true,
            messages: new List(),
        };
    }

    componentDidMount () {
        const { activeChannel, chatActions, params } = this.props;
        if (params.channel && activeChannel !== params.channel) {
            chatActions.setActiveChannel(params.channel);
        }
        if (this.chatInput) {
            this.chatInput.focus();
        }
        Channel.client.chat.fetch.on(this.hydrateMessages);
        Channel.server.chat.fetch.send({ channel: params.channel });
        // Simulate loading for 1 second in order to fetch enough messages
        this.timeout = setTimeout(() => { this.triggerDataLoaded(); }, 1000);
    }

    componentWillReceiveProps (nextProps) {
        const { chatActions, defaultChannel, params } = nextProps;
        if (params.channel !== this.props.params.channel) {
            chatActions.saveRecentChannel(params.channel || defaultChannel);
            this.setState({
                inputFocused: null,
                isScrollable: false,
                loadingData: true,
                messages: new List()
            }, () => {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => { this.triggerDataLoaded(); }, 1000);
                chatActions.setActiveChannel(params.channel);
                Channel.server.chat.fetch.send({ channel: params.channel });
            });
        }
    }

    componentDidUpdate (prevProps, prevState) {
        if (!this.messagesContainer) {
            return null;
        }
        if (this.state.messages.size !== prevState.messages.size ||
                this.state.loadingData !== prevState.loadingData) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
        if (!this.state.isScrollable &&
                this.messagesContainer.scrollHeight > this.messagesContainer.clientHeight) {
            this.setState({
                isScrollable: true
            });
        }
    }

    componentWillUnmount () {
        Channel.client.chat.fetch.removeListener(this.hydrateMessages);
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    triggerDataLoaded = () => {
        this.setState({
            loadingData: false
        });
    };

    isActive = (channel) => {
        const { params } = this.props;
        if (channel) {
            return channel === params.channel;
        }
        return !params.channel;
    };

    hydrateMessages = (ev, resp) => {
        let messages = null;
        if (resp.data && resp.data.message && this.isActive(resp.data.channel)) {
            messages = this.state.messages.push(resp.data.message);
        } else if (resp.data && resp.data.collection && this.isActive(resp.data.channel)) {
            messages = this.state.messages.concat(resp.data.collection);
        }
        if (messages) {
            messages = messages
                .groupBy(msg => msg.messageHash + msg.timeStamp)
                .map(arr => arr.first())
                .toList()
                .sortBy(msg => msg.timeStamp);
            this.setState({
                messages
            });
        }
    }

    handleKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            Channel.server.chat.post.send({ message: ev.target.value });
            this.setState({
                currentMessage: ''
            });
        }
    };

    handleInputChange = (ev) => {
        this.setState({
            currentMessage: ev.target.value.slice(0, CHARACTER_LIMIT)
        });
    };


    navigateToProfile = (profileAddress) => {
        const { loggedProfileAkashaId } = this.props;
        this.context.router.push(`${loggedProfileAkashaId}/profile/${profileAddress}`);
    }

    onInputFocus = () => {
        this.setState({
            inputFocused: true
        });
    };

    onInputBlur = () => {
        this.setState({
            inputFocused: false
        });
    };

    getActiveChannel = () => {
        const { defaultChannel, params } = this.props;
        return params.channel || defaultChannel;
    };

    handleStartAction = () => {
        const { chatActions, joinedChannels } = this.props;
        const activeChannel = this.getActiveChannel();
        const isChannelSaved = joinedChannels.indexOf(activeChannel) !== -1;
        if (isChannelSaved) {
            return chatActions.deleteChannel(activeChannel);
        }
        return chatActions.saveChannel(activeChannel);
    }

    renderHeader = () => {
        const { joinedChannels } = this.props;
        const { palette } = this.context.muiTheme;
        const activeChannel = this.getActiveChannel();
        const isChannelSaved = joinedChannels.indexOf(activeChannel) !== -1;
        return (
          <div
            style={{
                padding: '18px 30px',
                textAlign: 'left',
                fontSize: '24px',
                lineHeight: '28px',
                height: '64px',
                flex: '0 0 64px',
                boxShadow: this.state.isScrollable ?
                    `0px 3px 3px -1px ${palette.paperShadowColor}` :
                    'none',
                borderBottom: !this.state.isScrollable ?
                    `1px solid ${palette.borderColor}` :
                    'none',
                zIndex: 12
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              #{activeChannel}
              {activeChannel !== joinedChannels.first() &&
                <IconButton
                  style={{ height: '28px', width: '28px', padding: '7px', marginLeft: '10px' }}
                  iconStyle={{ height: '14px', width: '14px' }}
                  onClick={this.handleStartAction}
                >
                  <SvgIcon viewBox="0 0 18 18">
                    {isChannelSaved ?
                      <EntryBookmarkOn /> :
                      <EntryBookmarkOff />
                    }
                  </SvgIcon>
                </IconButton>
              }
            </div>
          </div>
        );
    };

    render () {
        const { intl, loggedProfileAddress, loggedProfileAkashaId,
            loggedProfileAvatar, loggedProfileInitials, navigateToChannel } = this.props;
        const { palette } = this.context.muiTheme;

        return (
          <div
            style={{
                width: 'calc(100% - 200px + 7px)',
                position: 'relative',
                left: '200px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}
          >
            {this.renderHeader()}
            <div style={{ position: 'relative', flex: '1 1 auto', zIndex: 10 }}>
              <div
                ref={(el) => { this.messagesContainer = el; }}
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    overflowY: 'auto'
                }}
              >
                <ChatMessagesList
                  loadingData={this.state.loadingData}
                  loggedProfileAkashaId={loggedProfileAkashaId}
                  messages={this.state.messages}
                  navigateToChannel={navigateToChannel}
                  onAuthorClick={this.navigateToProfile}
                />
              </div>
            </div>
            <div
              style={{
                  flex: '0 0 80px',
                  position: 'relative',
                  minHeight: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  borderTop: `1px solid ${palette.borderColor}`,
                  margin: '0 30px'
              }}
            >
              {this.state.inputFocused &&
                <div
                  style={{
                      position: 'absolute',
                      width: '50px',
                      height: '12px',
                      zIndex: 9,
                      backgroundColor: palette.canvasColor,
                      left: 'calc(50% - 25px)',
                      top: '-10px',
                  }}
                />
              }
              {this.state.inputFocused &&
                <div
                  style={{
                      position: 'absolute',
                      textAlign: 'center',
                      zIndex: 11,
                      width: '26px',
                      backgroundColor: palette.canvasColor,
                      left: 'calc(50% - 13px)',
                      top: '-10px',
                      fontSize: '12px',
                      padding: '0 2px'
                  }}
                >
                  <span style={{ backgroundColor: palette.canvasColor }}>
                    {CHARACTER_LIMIT - this.state.currentMessage.length}
                  </span>
                </div>
              }
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', height: '72px' }}>
                <div style={{ display: 'inline-block', flex: '0 0 auto' }}>
                  <Avatar
                    image={loggedProfileAvatar}
                    userInitials={loggedProfileInitials}
                    userInitialsStyle={{ fontSize: '20px' }}
                    style={{ cursor: 'pointer' }}
                    radius={40}
                    onClick={() => { this.navigateToProfile(loggedProfileAddress); }}
                  />
                </div>
                <TextField
                  id="chatInput"
                  ref={(el) => { this.chatInput = el; }}
                  placeholder={intl.formatMessage(chatMessages.inputPlaceholder)}
                  value={this.state.currentMessage}
                  onKeyDown={this.handleKeyDown}
                  onChange={this.handleInputChange}
                  onFocus={this.onInputFocus}
                  onBlur={this.onInputBlur}
                  style={{ flex: '1 1 auto', paddingLeft: '10px' }}
                  underlineShow={false}
                  multiLine
                  rowsMax={2}
                />
              </div>
            </div>
          </div>
        );
    }
}

ChatChannel.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

ChatChannel.propTypes = {
    activeChannel: PropTypes.string,
    chatActions: PropTypes.shape(),
    defaultChannel: PropTypes.string,
    intl: PropTypes.shape(),
    joinedChannels: PropTypes.shape(),
    loggedProfileAddress: PropTypes.string,
    loggedProfileAkashaId: PropTypes.string,
    loggedProfileAvatar: PropTypes.string,
    loggedProfileInitials: PropTypes.string,
    navigateToChannel: PropTypes.func,
    params: PropTypes.shape(),
};

export default injectIntl(ChatChannel);
