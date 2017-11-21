import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import classNames from 'classnames';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { calculateReadingTime, getDisplayName } from '../../utils/dataModule';
import { Avatar, ProfilePopover } from '../';

const EntryCardHeader = (props) => {
    const { author, containerRef, entry, intl, isOwnEntry, large, openVersionsPanel } = props;
    const ethAddress = entry.getIn(['author', 'ethAddress']);
    const akashaId = entry.getIn(['author', 'akashaId']);
    const content = entry.get('content');
    const publishDate = new Date(entry.get('publishDate') * 1000);
    const wordCount = (content && content.get('wordCount')) || 0;
    const readingTime = calculateReadingTime(wordCount);
    const latestVersion = content && content.get('version');
    const displayName = ethAddress && getDisplayName({ akashaId, ethAddress });
    let titleMaxWidth = large ? 450 : 270;
    if (isOwnEntry) {
        titleMaxWidth -= 24;
    }
    const titleClass = classNames('overflow-ellipsis entry-card-header__title', {
        'content-link': displayName,
    });
    const authorPlaceholder = (
      <Tooltip title="Cannot resolve entry author">
        <div className="entry-card-header__author-placeholder" />
      </Tooltip>
    );
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
          <ProfilePopover
            ethAddress={ethAddress}
            containerRef={containerRef}
          >
            <span className={titleClass} style={{ maxWidth: titleMaxWidth }}>
              {displayName || authorPlaceholder}
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
        {isOwnEntry &&
          <Icon className="content-link entry-card-header__edit-icon" type="edit" />
        }
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
    large: PropTypes.bool,
    openVersionsPanel: PropTypes.func.isRequired,
};

export default injectIntl(EntryCardHeader);
