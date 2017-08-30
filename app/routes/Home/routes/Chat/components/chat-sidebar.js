import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { chatMessages, generalMessages } from 'locale-data/messages';
import { Dialog, IconButton, List, ListItem, RaisedButton, Subheader,
    SvgIcon, TextField } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import RemoveIcon from 'material-ui/svg-icons/action/highlight-off';
import ExpandIcon from 'material-ui/svg-icons/navigation/expand-more';
import CollapseIcon from 'material-ui/svg-icons/navigation/expand-less';
import { EntryBookmarkOn, EntryBookmarkOff } from '../../../../../components/svg';
import styles from './chat-sidebar.scss';

const CHANNEL_CHAR_LIMIT = 32;
const EMPTY_CHANNEL = 'emptyChannelInputError';
const START_WITH_ALPHANUMBERIC = 'startWithAlphanumericError';
const ILLEGAL_CHARACTERS = 'illegalCharactersFormat';
const TOO_LONG = 'channelTooLongError';

const buttonStyle = {
    position: 'absolute',
    right: '20px',
    top: 0,
    width: '22px',
    height: '22px',
    padding: '4px',
    margin: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

class ChatSidebar extends Component {
    state = {
        channel: '',
        channelError: null,
        isDialogOpen: false,
        showAll: false
    };

    isActive = (channel) => {
        const { activeChannel, joinedChannels } = this.props;
        return activeChannel ?
            channel === activeChannel :
            channel === joinedChannels.first();
    };

    handleChannelValidation = (value) => {
        let error;
        if (!value) {
            error = EMPTY_CHANNEL;
        } else if (!/^[a-z0-9\-_]*$/.test(value)) {
            error = ILLEGAL_CHARACTERS;
        } else if (!/^[a-z0-9]/.test(value)) {
            error = START_WITH_ALPHANUMBERIC;
        } else if (value.length > CHANNEL_CHAR_LIMIT) {
            error = TOO_LONG;
        }
        this.setState({
            channelError: error || null
        });
        return error;
    };

    openDialog = () => {
        this.setState({
            isDialogOpen: true
        });
    };

    onSubmit = (ev) => {
        ev.preventDefault();
        this.handleJoin();
    };

    handleJoin = () => {
        const { navigateToChannel } = this.props;
        const error = this.handleChannelValidation(this.state.channel);
        if (!error) {
            navigateToChannel(this.state.channel);
            this.handleCancel();
        }
    }

    handleCancel = () => {
        this.setState({
            channel: '',
            channelError: null,
            isDialogOpen: false
        });
    };

    handleChannelInputChange = (ev) => {
        const value = ev.target.value.slice(1);
        this.handleChannelValidation(value);
        this.setState({
            channel: value
        });
    }

    expandJoinedChannels = () => {
        this.setState({
            showAll: true
        });
    };

    collapseJoinedChannels = () => {
        this.setState({
            showAll: false
        });
    };

    renderDialog = () => {
        const { intl } = this.props;
        const dialogActions = [
          <RaisedButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.cancel)}
            onTouchTap={this.handleCancel}
            style={{ margin: '10px 5px' }}
          />,
          <RaisedButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.join)}
            primary
            onTouchTap={this.handleJoin}
            style={{ margin: '10px 5px' }}
            disabled={!!this.state.channelError}
          />
        ];

        return (
          <Dialog
            contentStyle={{ width: 420, maxWidth: 'none', height: '415px' }}
            bodyStyle={{ paddingBottom: '24px' }}
            title={intl.formatMessage(chatMessages.joinChannel)}
            onRequestClose={this.handleCancel}
            open
            actions={dialogActions}
          >
            <form onSubmit={this.onSubmit}>
              <TextField
                value={`#${this.state.channel}`}
                onChange={this.handleChannelInputChange}
                fullWidth
                autoFocus
                floatingLabelFixed
                floatingLabelText={intl.formatMessage(chatMessages.channelName)}
                errorText={this.state.channelError &&
                    intl.formatMessage(chatMessages[this.state.channelError])
                }
                errorStyle={{ position: 'absolute', top: '68px' }}
              />
            </form>
          </Dialog>
        );
    };

    renderStarButton = (channel) => {
        const { joinChannel, joinedChannels, leaveChannel } = this.props;
        const isAdded = joinedChannels.indexOf(channel) !== -1;
        const isDefaultChannel = joinedChannels.indexOf(channel) === 0;
        if (isDefaultChannel) {
            return null;
        }
        return (
          <IconButton
            style={{
                padding: '5px',
                display: 'inline-block',
                width: '22px',
                height: '22px',
                margin: '0px'
            }}
            iconStyle={{ width: '12px', height: '12px' }}
            onClick={(ev) => {
                ev.stopPropagation();
                if (isAdded) {
                    leaveChannel(channel);
                } else {
                    joinChannel(channel);
                }
            }}
          >
            <SvgIcon viewBox="0 0 18 18">
              {isAdded ?
                <EntryBookmarkOn /> :
                <EntryBookmarkOff />
              }
            </SvgIcon>
          </IconButton>
        );
    };

    renderDeleteButton = (channel) => {
        const { deleteRecentChannel } = this.props;
        return (
          <RemoveIcon
            onClick={(ev) => {
                ev.stopPropagation();
                deleteRecentChannel(channel);
            }}
            style={{ width: '22px', height: '22px', padding: '4px' }}
          />
        );
    };

    renderChannelList = (channels, hasDeleteButton) => {
        const { navigateToChannel } = this.props;
        const { palette } = this.context.muiTheme;
        const className = hasDeleteButton ? styles.recentChannelRow : styles.joinedChannelRow;
        const innerDivStyle = {
            display: 'flex',
            alignItems: 'center',
            height: '22px',
            padding: '0px 20px',
        };
        const primaryTextStyle = {
            lineHeight: '18px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        };

        return (
          <List style={{ paddingTop: 0 }}>
            {channels.map(channel =>
              <ListItem
                key={channel}
                className={`has-hidden-action ${className}`}
                innerDivStyle={innerDivStyle}
                primaryText={
                  <div
                    className={styles.channelName}
                    style={Object.assign({}, primaryTextStyle, {
                        color: this.isActive(channel) ?
                            palette.primary1Color :
                            palette.textColor
                    })}
                  >
                    #{channel}
                  </div>
                }
                onClick={() => navigateToChannel(channel)}
              >
                <div
                  className="hidden-action"
                  style={{
                      position: 'absolute',
                      right: '20px',
                      top: '0px',
                      height: '22px',
                      display: 'flex',
                      alignItems: 'center'
                  }}
                >
                  {this.renderStarButton(channel)}
                  {hasDeleteButton && this.renderDeleteButton(channel)}
                </div>
              </ListItem>
            )}
          </List>
        );
    };

    render () {
        const { intl, joinedChannels, recentChannels } = this.props;
        const visibleJoinedChannels = joinedChannels.size > 10 && !this.state.showAll ?
            joinedChannels.take(10) :
            joinedChannels;
        let isExpanded;
        if (joinedChannels.size > 10) {
            isExpanded = this.state.showAll;
        }
        const subheaderStyle = {
            position: 'relative',
            marginTop: '17px',
            paddingLeft: '20px',
            height: '30px',
            display: 'flex',
            alignItems: 'center',
        };
        const titleStyle = {
            position: 'relative',
            textTransform: 'upperCase',
            width: '100%',
            height: '22px',
            lineHeight: '23px'
        };
        const iconStyle = {
            cursor: 'pointer',
            position: 'absolute',
            top: '6px',
            left: '2px',
            width: '18px',
            height: '18px'
        };
        return (
          <div>
            <div
              style={{
                  position: 'fixed',
                  top: 0,
                  bottom: 0,
                  left: 64,
                  width: '200px',
                  backgroundColor: '#F3F3F3',
                  overflowY: 'auto',
                  overflowX: 'hidden'
              }}
            >
              <div style={{ width: '200px' }}>
                <Subheader style={subheaderStyle}>
                  <small style={titleStyle}>
                    {intl.formatMessage(chatMessages.joinedChannels)}
                    {isExpanded !== undefined &&
                      <IconButton
                        style={buttonStyle}
                        iconStyle={{ width: '14px', height: '14px' }}
                        onClick={isExpanded ? this.collapseJoinedChannels : this.expandJoinedChannels}
                      >
                        {isExpanded ?
                          <CollapseIcon style={iconStyle} onClick={this.collapseJoinedChannels} /> :
                          <ExpandIcon style={iconStyle} onClick={this.expandJoinedChannels} />
                        }
                      </IconButton>
                    }
                  </small>
                </Subheader>
                {this.renderChannelList(visibleJoinedChannels)}
                <Subheader style={subheaderStyle}>
                  <small style={titleStyle}>
                    {intl.formatMessage(chatMessages.recentChannels)}
                    <IconButton
                      style={buttonStyle}
                      iconStyle={{ width: '14px', height: '14px' }}
                      onClick={this.openDialog}
                    >
                      <AddIcon />
                    </IconButton>
                  </small>
                </Subheader>
                {this.renderChannelList(recentChannels, true)}
              </div>
            </div>
            {this.state.isDialogOpen && this.renderDialog()}
          </div>
        );
    }
}

ChatSidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

ChatSidebar.propTypes = {
    activeChannel: PropTypes.string,
    deleteRecentChannel: PropTypes.func,
    intl: PropTypes.shape(),
    joinChannel: PropTypes.func,
    joinedChannels: PropTypes.shape(),
    leaveChannel: PropTypes.func,
    navigateToChannel: PropTypes.func,
    recentChannels: PropTypes.shape(),
};

export default injectIntl(ChatSidebar);
