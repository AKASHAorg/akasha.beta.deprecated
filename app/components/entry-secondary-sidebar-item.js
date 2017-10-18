import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from 'antd';
import { entryMessages } from '../locale-data/messages';

const getIconType = (localChanges, published, unresolved) => {
    switch (true) {
        case unresolved:
            return 'dot red-dot';
        case (localChanges && published):
            return 'dot';
        case (!localChanges && published):
            return 'check';
        default:
            return 'hdd';
    }
};

const EntrySecondarySidebarItem = ({
    draft, active, intl, matchString, onItemClick, showDraftMenuDrowpdown, onDraftDelete, onPreviewCreate,
    published, localChanges, unresolved
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
      <Icon
        type={getIconType(localChanges, published, unresolved)}
      />
      <a
        href="/"
        dangerouslySetInnerHTML={{ __html: matchString }}
        className="draft-list-item__link"
        onClick={ev => onItemClick(ev, `/draft/${draft.entryType}/${draft.id}`)}
      />
    </div>
    }
    {!matchString &&
    <div>
      <Icon
        type={getIconType(localChanges, published, unresolved)}
      />
      <a
        href="/"
        className="draft-list-item__link"
        onClick={ev => onItemClick(ev, `/draft/${draft.entryType}/${draft.id}`)}
      >
        {draft.entryType === 'article' && ((draft.content && draft.content.title) || 'No title') }
        {draft.entryType === 'link' && ((draft.content && draft.content.cardInfo.title) || 'No title')}
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
                onClick={ev => onItemClick(ev, `/draft/${draft.entryType}/${draft.id}`)}
              >
                <b>{intl.formatMessage(entryMessages.draftEdit)}</b>
              </div>
            }
            <div
              className="draft-list-item__popover-button"
              onClick={ev => onPreviewCreate(ev, draft.id)}
            >
              <b>{intl.formatMessage(entryMessages.draftSharePreview)}</b>
            </div>
            <div
              className="draft-list-item__popover-button"
              onClick={ev => onDraftDelete(ev, draft.id)}
            >
              <b>{intl.formatMessage(entryMessages.draftDelete)}</b>
            </div>
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
};

export default EntrySecondarySidebarItem;
