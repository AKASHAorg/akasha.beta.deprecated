import React, { Component, PropTypes } from 'react';
import { Avatar } from 'shared-components';
import { getInitials } from 'utils/dataModule';
import imageCreator from 'utils/imageUtils';
import { FormattedTime } from 'react-intl';

class ChatMessage extends Component {
    render () {
        const { data, isOwnMessage, onAuthorClick } = this.props;
        const { akashaId, avatar, baseUrl, firstName, lastName, message, profileAddress,
            timeStamp } = data;
        const { palette } = this.context.muiTheme;
        const authorAvatar = avatar ?
            imageCreator(avatar, baseUrl) :
            null;
        const authorInitials = getInitials(firstName, lastName);

        return (
          <div style={{ padding: '10px 0', display: 'flex', alignItems: 'flex-start' }}>
            <Avatar
              image={authorAvatar}
              style={{ display: 'inline-block', cursor: 'pointer' }}
              userInitials={authorInitials}
              userInitialsStyle={{ fontSize: '20px' }}
              radius={40}
              onClick={() => { onAuthorClick(profileAddress); }}
            />
            <div style={{ display: 'inline-block', padding: '0 10px' }}>
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
              <div style={{ paddingTop: '5px', lineHeight: '18px' }}>{message}</div>
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
    onAuthorClick: PropTypes.func
};

export default ChatMessage;