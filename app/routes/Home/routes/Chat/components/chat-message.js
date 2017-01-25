import React, { Component, PropTypes } from 'react';
import { Avatar } from 'shared-components';
import { getInitials } from 'utils/dataModule';
import imageCreator from 'utils/imageUtils';
import { FormattedTime } from 'react-intl';

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
                    className="textLink"
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
        const { data, isOwnMessage, onAuthorClick } = this.props;
        const { avatar, baseUrl, firstName, lastName, profileAddress,
            timeStamp } = data;
        const { palette } = this.context.muiTheme;
        const authorAvatar = avatar ?
            imageCreator(avatar, baseUrl) :
            null;
        const authorInitials = getInitials(firstName, lastName);

        return (
          <div style={{ padding: '10px 0', display: 'flex', alignItems: 'flex-start' }}>
            <button
              style={{
                  border: '0px',
                  outline: 'none',
                  background: 'transparent',
                  borderRadius: '50%',
                  width: '52px'
              }}
              onClick={() => { onAuthorClick(profileAddress); }}
            >
              <Avatar
                image={authorAvatar}
                style={{ display: 'inline-block', cursor: 'pointer' }}
                userInitials={authorInitials}
                userInitialsStyle={{ fontSize: '20px' }}
                radius={40}
              />
            </button>
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
                  className="contentLink"
                  onClick={() => { onAuthorClick(profileAddress); }}
                  style={{
                      display: 'inline-block',
                      paddingRight: '5px',
                      color: isOwnMessage ? palette.commentViewerIsAuthorColor : palette.textColor
                  }}
                >
                  {`${firstName} ${lastName}`}
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
    onAuthorClick: PropTypes.func
};

export default ChatMessage;
