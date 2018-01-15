import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from 'antd';
import { Icon as SvgIcon } from './';
import { entryMessages } from '../locale-data/messages';

const getIconType = (localChanges, published, unresolved, entryType) => {
    switch (true) {
        case unresolved:
            return <Icon type="dot red-dot" />;
        case (localChanges && published):
            return <SvgIcon type={(entryType === 'article') ? 'textEntry' : 'linkEntry'} className="new-entry-secondary-sidebar__icon_yellow" />;
        case (!localChanges && published):
            return <SvgIcon type={(entryType === 'article') ? 'textEntry' : 'linkEntry'} className="new-entry-secondary-sidebar__icon" />;
        case !published:
            return <SvgIcon type={(entryType === 'article') ? 'textEntry' : 'linkEntry'} className="new-entry-secondary-sidebar__icon" />;
        default:
            return <SvgIcon type="draft" />;
    }
};

const EntrySecondarySidebarItem = ({
    draft, active, intl, matchString, onItemClick, showDraftMenuDrowpdown, onDraftDelete, onPreviewCreate,
    published, localChanges, unresolved, onDraftRevert
}) => (
  <div
    className={
      `new-entry-secondary-sidebar__draft-list-item
       new-entry-secondary-sidebar__draft-list-item${
       (active ? '_active' : '')
      }`
    }
  >
    {/* eslint-disable react/no-danger */}
    {matchString &&
    <div>
        {getIconType(localChanges, published, unresolved, draft.content.entryType)}
      <a
        href="/"
        dangerouslySetInnerHTML={{ __html: matchString }}
        className="draft-list-item__link"
        onClick={ev => onItemClick(ev, `/draft/${draft.content.entryType}/${draft.id}`)}
      />
    </div>
    }
    {!matchString &&
    <div>
      {getIconType(localChanges, published, unresolved, draft.content.entryType)}
      <a
        href="/"
        className="draft-list-item__link"
        onClick={ev => onItemClick(ev, `/draft/${draft.content.entryType}/${draft.id}`)}
      >
        {draft.content.entryType === 'article' &&
            ((draft.content && draft.content.title) || intl.formatMessage(entryMessages.noTitle))
        }
        {draft.content.entryType === 'link' &&
            ((draft.content && draft.content.cardInfo.title) || intl.formatMessage(entryMessages.noTitle))
        }
      </a>
    </div>
    }
    {/* eslint-enable react/no-danger */}
    <span
      className="draft-list-item__menu-container"
    >
      <Popover
        placement="bottomLeft"
        overlayClassName="draft-list-item__popover"
        content={
          <div>
            {!active &&
              <div
                className="draft-list-item__popover-button"
                onClick={ev => onItemClick(ev, `/draft/${draft.content.entryType}/${draft.id}`)}
              >
                <b>{intl.formatMessage(entryMessages.draftEdit)}</b>
              </div>
            }
            <div
              className="draft-list-item__popover-button disabled-button"
              onClick={ev => onPreviewCreate(ev, draft.id)}
            >
              <b>{intl.formatMessage(entryMessages.draftSharePreview)}</b>
            </div>
            {!published &&
              <div
                className="draft-list-item__popover-button"
                onClick={ev => onDraftDelete(ev, draft.id)}
              >
                <b>{intl.formatMessage(entryMessages.draftDelete)}</b>
              </div>
            }
            {published && localChanges &&
              <div
                className="draft-list-item__popover-button"
                onClick={ev => onDraftRevert(ev, draft.id)}
              >
                <b>{intl.formatMessage(entryMessages.draftRevert)}</b>
              </div>
            }
          </div>
        }
        trigger="click"
      >
        <Icon
          className="draft-list-item__menu-button"
          type="ellipsis"
          onClick={showDraftMenuDrowpdown}
        />
      </Popover>
    </span>
  </div>
);

EntrySecondarySidebarItem.propTypes = {
    active: PropTypes.bool,
    draft: PropTypes.shape(),
    intl: PropTypes.shape(),
    matchString: PropTypes.string,
    onItemClick: PropTypes.func,
    onDraftDelete: PropTypes.func,
    onPreviewCreate: PropTypes.func,
    published: PropTypes.bool,
    localChanges: PropTypes.bool,
    showDraftMenuDrowpdown: PropTypes.func,
    unresolved: PropTypes.bool,
    onDraftRevert: PropTypes.func,
};

export default EntrySecondarySidebarItem;
