import React, { PropTypes } from 'react';
import Notification from './notification';

const EntryNotification = (props, context) => {
    const { blockNumber, deleteNotif, disableNotifications, enableNotifications, entry, index,
        isMuted, isOwnNotif, navigateToEntry, navigateToProfile, navigateToTag, profile,
        tags } = props;
    const { palette } = context.muiTheme;
    const allTags = [].concat(tags);
    const tagsMessage = allTags.length > 1 ? 'tags' : 'tag';
    const tagsArray = allTags.map((tag, key) =>
      <span key={tag}>
        <span className="link" onClick={() => navigateToTag(tag)}>{tag}</span>
        {key !== allTags.length - 1 ? ', ' : ''}
      </span>
    );
    const message = (
      <div>
        <div className="overflow-ellipsis" style={{ color: palette.textColor, whiteSpace: 'normal' }}>
          Published
          <span
            className="link overflow-ellipsis"
            style={{ paddingLeft: '5px' }}
            onClick={() => navigateToEntry(entry.entryId)}
          >
            {entry.content.title}
          </span>
          <span> on {tagsMessage} {tagsArray} </span>
        </div>
        Block {blockNumber}
      </div>
    );
    return (
      <Notification
        deleteNotif={() => deleteNotif(index)}
        disableNotifications={disableNotifications}
        enableNotifications={enableNotifications}
        isMuted={isMuted}
        isOwnNotif={isOwnNotif}
        message={message}
        navigateToProfile={navigateToProfile}
        profile={profile}
      />
    );
};

EntryNotification.contextTypes = {
    muiTheme: PropTypes.shape()
};

EntryNotification.propTypes = {
    blockNumber: PropTypes.number,
    deleteNotif: PropTypes.func,
    disableNotifications: PropTypes.func,
    enableNotifications: PropTypes.func,
    entry: PropTypes.shape(),
    index: PropTypes.number,
    isMuted: PropTypes.bool,
    isOwnNotif: PropTypes.bool,
    navigateToEntry: PropTypes.func,
    navigateToProfile: PropTypes.func,
    navigateToTag: PropTypes.func,
    profile: PropTypes.shape(),
    tags: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string)
    ])
};

export default EntryNotification;
