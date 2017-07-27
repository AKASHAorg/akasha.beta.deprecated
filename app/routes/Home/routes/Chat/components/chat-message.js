import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FormattedTime } from 'react-intl';
import { Avatar } from 'shared-components'; // eslint-disable-line import/no-unresolved, import/extensions
import { getInitials } from 'utils/dataModule';  // eslint-disable-line import/no-unresolved, import/extensions
import imageCreator from 'utils/imageUtils';  // eslint-disable-line import/no-unresolved, import/extensions

class ChatMessage extends Component {
    renderMessage = () => {
        const { palette } = this.context.muiTheme;
        const { navigateToChannel } = this.props;
        const { message } = this.props.data;
        const containsLink = message.match(/(^|\s)#[a-z0-9][a-z0-9\-_]+(\s|$)/g);
        if (!containsLink) {
            return message;
        }
        const words = message.split(/\s/);
        const parts = words.map((word, index) => {
            if (word.match(/^#[a-z0-9][a-z0-9\-_]+/) && word.length <= 33) {
                return (
                  <span
                    key={index}
                    className="content-link"
                    style={{ color: palette.primary1Color }}
                    onClick={() => navigateToChannel(word.slice(1))}
                  >
                    {`${word} `}
                  </span>
                );
            }
            return <span key={index}>{word} </span>;
        });
        return (
          <div>
            {parts}
          </div>
        );
    };

    render () {
        const { data, isOwnMessage, onAuthorClick, showProfileHoverCard,
            hideProfileHoverCard } = this.props;
        const { akashaId, avatar, baseUrl, firstName, lastName, profileAddress,
            timeStamp } = data;
        const { palette } = this.context.muiTheme;
        const authorAvatar = avatar ?
            imageCreator(avatar, baseUrl) :
            null;
        const authorInitials = getInitials(firstName, lastName);
        const profile = {
            akashaId,
            avatar,
            baseUrl,
            firstName,
            lastName,
            profile: profileAddress
        };
        return (
          <div style={{ position: 'relative', padding: '10px 0', display: 'flex', alignItems: 'flex-start' }}>
            <Avatar
              image={authorAvatar}
              style={{ display: 'inline-block', cursor: 'pointer' }}
              userInitials={authorInitials}
              userInitialsStyle={{ fontSize: '20px' }}
              size={40}
              onClick={() => { onAuthorClick(profileAddress); }}
              onMouseEnter={ev => showProfileHoverCard(ev.currentTarget, profile)}
              onMouseLeave={hideProfileHoverCard}
            />
            <div
              style={{
                  display: 'inline-block',
                  padding: '0 10px',
                  width: 'calc(100% - 52px)',
                  wordWrap: 'break-word'
              }}
            >
              <div style={{ lineHeight: '14px', fontSize: '12px' }}>
                <div
                  className="content-link"
                  onClick={() => { onAuthorClick(profileAddress); }}
                  style={{
                      display: 'inline-block',
                      paddingRight: '5px',
                      color: isOwnMessage ? palette.commentViewerIsAuthorColor : palette.textColor
                  }}
                  onMouseEnter={ev => showProfileHoverCard(ev.currentTarget, profile)}
                  onMouseLeave={hideProfileHoverCard}
                >
                  {akashaId}
                </div>
                <FormattedTime value={new Date(timeStamp * 1000)} />
              </div>
              <div style={{ paddingTop: '5px', lineHeight: '18px' }}>
                {this.renderMessage()}
              </div>
            </div>
          </div>
        );
    }
}

ChatMessage.contextTypes = {
    muiTheme: PropTypes.shape()
};

ChatMessage.propTypes = {
    data: PropTypes.shape(),
    isOwnMessage: PropTypes.bool,
    navigateToChannel: PropTypes.func,
    onAuthorClick: PropTypes.func,
    showProfileHoverCard: PropTypes.func,
    hideProfileHoverCard: PropTypes.func,
};

export default ChatMessage;
