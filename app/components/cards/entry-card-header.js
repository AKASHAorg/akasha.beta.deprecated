import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { calculateReadingTime } from '../../utils/dataModule';
import { Avatar, ProfilePopover } from '../';

const EntryCardHeader = (props) => {
    const { containerRef, entry, intl, openVersionsPanel, publisher } = props;
    const content = entry.get('content');
    const publishDate = new Date(entry.getIn(['entryEth', 'unixStamp']) * 1000);
    const wordCount = (content && content.get('wordCount')) || 0;
    const readingTime = calculateReadingTime(wordCount);
    const latestVersion = content && content.get('version');
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
        <ProfilePopover akashaId={publisher.get('akashaId')} containerRef={containerRef}>
          <Avatar
            className="entry-card-header__avatar"
            firstName={publisher.get('firstName')}
            image={publisher.get('avatar')}
            lastName={publisher.get('lastName')}
            size="small"
          />
        </ProfilePopover>
        <div className="entry-card-header__text">
          <ProfilePopover akashaId={publisher.get('akashaId')} containerRef={containerRef}>
            <span className="content-link">
              {publisher.get('akashaId')}
            </span>
          </ProfilePopover>
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
        </div>
      </div>
    );
};

EntryCardHeader.propTypes = {
    containerRef: PropTypes.shape(),
    entry: PropTypes.shape(),
    intl: PropTypes.shape().isRequired,
    isNotSafe: PropTypes.bool,
    isOwnEntry: PropTypes.bool,
    openVersionsPanel: PropTypes.func.isRequired,
    publisher: PropTypes.shape()
};

export default injectIntl(EntryCardHeader);
