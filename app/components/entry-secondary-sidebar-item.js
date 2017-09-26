import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Icon } from 'antd';
import { entryMessages } from '../locale-data/messages';

const EntrySecondarySidebarItem = ({
    draft, active, intl, matchString, onItemClick, showDraftMenuDrowpdown, onDraftDelete, onPreviewCreate
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
      <a
        href="/"
        dangerouslySetInnerHTML={{ __html: matchString }}
        className="draft-list-item__link"
        onClick={ev => onItemClick(ev, `/draft/${draft.type}/${draft.id}`)}
      />
    }
    {!matchString &&
      <a
        href="/"
        className="draft-list-item__link"
        onClick={ev => onItemClick(ev, `/draft/${draft.type}/${draft.id}`)}
      >
        { draft.content.title || 'No title' }
      </a>
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
                onClick={ev => onItemClick(ev, `/draft/${draft.type}/${draft.id}`)}
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
    showDraftMenuDrowpdown: PropTypes.func,
};

export default EntrySecondarySidebarItem;
