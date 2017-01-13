import React, { Component, PropTypes } from 'react';
import { injectIntl, FormattedHTMLMessage } from 'react-intl';
import { Chip, Subheader, TextField } from 'material-ui';
import { chatMessages } from 'locale-data/messages';
import { Avatar } from 'shared-components';
import { List } from 'immutable';
import ChatMessagesList from './ChatMessagesList';

const CHARACTER_LIMIT = 128;

class ChatPage extends Component {
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
        if (this.chatInput) {
            this.chatInput.focus();
        }
        Channel.client.chat.fetch.on(this.hydrateMessages);
        Channel.server.chat.fetch.send({});
        // Simulate loading for 1 second in order to fetch enough messages
        this.timeout = setTimeout(() => { this.triggerDataLoaded(); }, 1000);
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

    hydrateMessages = (ev, resp) => {
        let messages = null;
        if (resp.data && resp.data.message) {
            messages = this.state.messages.push(resp.data);
        } else if (resp.data && resp.data.collection) {
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

    render () {
        const { intl, loggedProfileAddress, loggedProfileAkashaId, loggedProfileAvatar,
            loggedProfileInitials } = this.props;
        const { palette } = this.context.muiTheme;
        const channelStyle = {
            color: palette.textColor,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: palette.primary1Color,
            backgroundColor: palette.canvasColor,
            borderRadius: 3,
            height: 34,
            width: '100%'
        };
        return (
          <div style={{ height: '100%', color: palette.textColor }}>
            <div
              style={{
                  width: 'calc(100% - 400px + 7px)',
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
              }}
            >
              <div
                style={{
                    padding: '10px',
                    fontStyle: 'italic',
                    textAlign: 'center',
                    lineHeight: '18px',
                    height: '60px',
                    flex: '0 0 60px',
                    boxShadow: this.state.isScrollable ?
                        `0px 3px 3px -1px ${palette.paperShadowColor}` :
                        'none',
                    zIndex: 12
                }}
              >
                <FormattedHTMLMessage
                  id="app.chat.headerMessage"
                  description="chat channel header message"
                  defaultMessage={`<div> Welcome to our first Whisper chat experiment!</div>
                    <div>Please note that this channel is ephemeral and messages will disappear in about 48h since publishing.</div>`
                  }
                />
              </div>
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
            <div
              style={{
                  position: 'fixed',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: '400px',
                  backgroundColor: '#F3F3F3'
              }}
            >
              <Subheader>
                <small
                  style={{ textTransform: 'upperCase', padding: '0 20px' }}
                >
                  {intl.formatMessage(chatMessages.recommendedChannels)}
                </small>
              </Subheader>
              <div style={{ padding: '5px 36px' }}>
                <Chip style={channelStyle}>akasha</Chip>
              </div>
            </div>
          </div>
        );
    }
}

ChatPage.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

ChatPage.propTypes = {
    intl: PropTypes.shape(),
    loggedProfileAddress: PropTypes.string,
    loggedProfileAkashaId: PropTypes.string,
    loggedProfileAvatar: PropTypes.string,
    loggedProfileInitials: PropTypes.string,
};

export default injectIntl(ChatPage);
