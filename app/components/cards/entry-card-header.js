import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Tooltip, Popover } from 'antd';
import classNames from 'classnames';
import { entryMessages, generalMessages } from '../../locale-data/messages';
import { calculateReadingTime, getDisplayName } from '../../utils/dataModule';
import { Avatar, Icon, ProfilePopover } from '../';
import { entryTypes } from '../../constants/entry-types';

const getVersionsPopoverContent = (latestVersion, intl, entry, onEntryVersionNavigation) => {
    const versionsEnum = Array(latestVersion + 1).fill('');
    return versionsEnum.map((version, index) => (
      <div
        key={`${index}`}
        className="popover-menu__item"
        onClick={() =>
            onEntryVersionNavigation(
                `/${entry.getIn(['author', 'ethAddress']) || '0x0'}/${entry.get('entryId')}/${index}`
            )
        }
      >
        {intl.formatMessage(entryMessages.versionNumber, {
            index: index + 1
        })}
      </div>
    ));
};
/* eslint-disable complexity */
const EntryCardHeader = (props) => {
    const { author, containerRef, entry, intl, isOwnEntry, large, loading,
        onEntryVersionNavigation, onDraftNavigation
    } = props;
    if (loading) {
        return (
          <div className="entry-card-header">
            <div className="entry-card-header__avatar entry-card-header__avatar_placeholder" />
            <div className="entry-card-header__text">
              <div className="entry-card-header__title_placeholder" />
              <div className="entry-card-header__subtitle_placeholder" />
            </div>
          </div>
        );
    }
    const ethAddress = entry.getIn(['author', 'ethAddress']);
    const akashaId = author.get('akashaId');
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
      <Tooltip
        getPopupContainer={() => containerRef || document.body}
        title={intl.formatMessage(entryMessages.tooltipAuthor)}
      >
        <div className="entry-card-header__author-placeholder" />
      </Tooltip>
    );
    const publishedMessage = latestVersion ? (
      <Popover
        content={
          getVersionsPopoverContent(latestVersion, intl, entry, onEntryVersionNavigation)
        }
        overlayClassName="popover-menu"
        placement="bottom"
        trigger="click"
      >
        <span className="entry-card-header__versions-button">
          {intl.formatMessage(entryMessages.published)}
          <span style={{ marginLeft: 3 }}>
            {intl.formatRelative(publishDate)}
          </span>
          <span style={{ marginLeft: 3, verticalAlign: 'middle' }}>
            <Icon type="arrowDropdownOpen" />
          </span>
        </span>
      </Popover>
    ) :
        intl.formatMessage(entryMessages.published);

    return (
      <div className="entry-card-header" id="versionsPopup">
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
            placement="bottomRight"
          >
            <span className={titleClass} style={{ maxWidth: titleMaxWidth }}>
              {displayName || authorPlaceholder}
            </span>
          </ProfilePopover>
          {entry.get('publishDate') &&
            <div className="entry-card-header__subtitle">
              {readingTime.hours &&
                intl.formatMessage(generalMessages.hoursCount, { hours: readingTime.hours })
              }
              {intl.formatMessage(generalMessages.minCount, { minutes: readingTime.minutes })}
              <span style={{ paddingLeft: '5px' }}>{intl.formatMessage(entryMessages.readTime)}</span>
              <span style={{ padding: '0 5px' }}>|</span>
              <span style={{ paddingRight: '3px' }}>
                {publishedMessage}
              </span>
              {!latestVersion &&
                <span>
                  {intl.formatRelative(publishDate)}
                </span>
              }
            </div>
          }
        </div>
        {isOwnEntry &&
          <Tooltip
            getPopupContainer={() => containerRef || document.body}
            title={intl.formatMessage(entryMessages.editEntry)}
          >
            <Icon
              className="content-link entry-card-header__edit-icon"
              type="edit"
              onClick={() =>
                onDraftNavigation(
                    `/draft/${entryTypes[entry.getIn(['content', 'entryType'])]}/${entry.get('entryId')}`
                )
              }
            />
          </Tooltip>
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
    loading: PropTypes.bool,
    onEntryVersionNavigation: PropTypes.func,
    onDraftNavigation: PropTypes.func,
};

export default injectIntl(EntryCardHeader);
