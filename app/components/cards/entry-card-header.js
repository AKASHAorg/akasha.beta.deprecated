import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { calculateReadingTime, getDisplayName } from '../../utils/dataModule';
import { Avatar, ProfilePopover } from '../';

const EntryCardHeader = (props) => {
    const { author, containerRef, entry, intl, openVersionsPanel } = props;
    const ethAddress = entry.getIn(['author', 'ethAddress']);    
    if (!ethAddress) {
        return <div>Cannot resolve author</div>;
    }
    const content = entry.get('content');
    const publishDate = new Date(entry.get('publishDate') * 1000);
    const wordCount = (content && content.get('wordCount')) || 0;
    const readingTime = calculateReadingTime(wordCount);
    const latestVersion = content && content.get('version');
    const displayName = getDisplayName({ akashaId: entry.getIn(['author', 'akashaId']), ethAddress });
    const publishedMessage = latestVersion ?
        (<span>
          <span onClick={openVersionsPanel} className="link">
            {intl.formatMessage(entryMessages.published)}
          </span>
          <span> *</span>
        </span>) :
        intl.formatMessage(entryMessages.published);

    return (
      <div className="entry-card-header">
        <ProfilePopover ethAddress={ethAddress} containerRef={containerRef}>
          <Avatar
            className="entry-card-header__avatar"
            firstName={author && author.get('firstName')}
            image={author && author.get('avatar')}
            lastName={author && author.get('lastName')}
            size="small"
          />
        </ProfilePopover>
        <div className="entry-card-header__text">
          <ProfilePopover ethAddress={ethAddress} containerRef={containerRef}>
            <span className="content-link">
              {displayName}
            </span>
          </ProfilePopover>
          {entry.get('publishDate') &&
            <div className="entry-card-header__subtitle">
              <span style={{ paddingRight: '5px' }}>
                {publishedMessage}
              </span>
              <span>
                {intl.formatRelative(publishDate)}
              </span>
              <span style={{ padding: '0 5px' }}>|</span>
              {readingTime.hours &&
                intl.formatMessage(generalMessages.hoursCount, { hours: readingTime.hours })
              }
              {intl.formatMessage(generalMessages.minCount, { minutes: readingTime.minutes })}
              <span style={{ paddingLeft: '5px' }}>{intl.formatMessage(entryMessages.readTime)}</span>
            </div>
          }
        </div>
      </div>
    );
};

EntryCardHeader.propTypes = {
    author: PropTypes.shape(),
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    isNotSafe: PropTypes.bool,
    isOwnEntry: PropTypes.bool,
    openVersionsPanel: PropTypes.func.isRequired,
};

export default injectIntl(EntryCardHeader);
