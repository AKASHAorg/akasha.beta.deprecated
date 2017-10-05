import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { List } from 'immutable';
import { Checkbox, Icon, Input } from 'antd';
import { PanelLink } from '../';
import { listMessages } from '../../locale-data/messages';

class PopoverSelectableList extends Component {

    componentWillUnmount () {
        if (this.focusTimeout) {
            clearInterval(this.focusTimeout);
        }
        if (this.resetTimeout) {
            clearInterval(this.resetTimeout);
        }
    }

    getSearchInputRef = (el) => { this.searchInput = el; };

    isSaved = (list) => {
        const { entryId } = this.props;
        return list.get('entryIds').includes(entryId);
    };

    groupByState = (lists) => {
        let saved = new List();
        let unsaved = new List();
        lists.forEach((list) => {
            if (this.isSaved(list)) {
                saved = saved.push(list);
            } else {
                unsaved = unsaved.push(list);
            }
        });
        return saved.concat(unsaved);
    };

    onKeyDown = (ev) => {
        if (ev.key === 'Escape') {
            this.searchList('');
        }
    };

    onSearchChange = (ev) => {
        this.searchList(ev.target.value);
    };

    setInputFocusAsync = () => {
        this.focusTimeout = setTimeout(() => {
            this.focusTimeout = null;
            const input = document.getElementById('list-popover-search');
            if (input) {
                input.focus();
            }
        }, 100);
    };

    searchList = search => this.props.listSearch(search);

    render () {
        const { entryId, intl, listDelete, lists, listToggleEntry, search } = this.props;

        return (
          <div className="list-popover__content">
            <div className="list-popover__input-wrapper">
              <Input
                className="list-popover__search"
                id="list-popover-search"
                onChange={this.onSearchChange}
                onKeyDown={this.onKeyDown}
                placeholder={intl.formatMessage(listMessages.searchForList)}
                prefix={<Icon className="list-popover__search-icon" type="search" />}
                ref={this.getSearchInputRef}
                size="large"
                value={search}
              />
            </div>
            <div className="list-popover__list-wrapper">
              {this.groupByState(lists).map((list) => {
                  const toggleList = () => listToggleEntry(list.get('name'), entryId);
                  const isSaved = this.isSaved(list);
                  const root = 'list-popover__left-item list-popover__row-icon';
                  const modifier = 'list-popover__row-icon_saved';
                  const className = `${root} ${isSaved && modifier}`;
                  return (
                    <div
                      className="has-hidden-action content-link list-popover__row"
                      key={list.get('id')}
                      onClick={toggleList}
                    >
                      <div className={`hidden-action-reverse ${className}`}>
                        {list.get('entryIds').size}
                      </div>
                      <div className="hidden-action list-popover__left-item">
                        <Checkbox checked={isSaved} />
                      </div>
                      <div className="overflow-ellipsis list-popover__name">
                        {list.get('name')}
                      </div>
                      <div className="hidden-action" onClick={ev => ev.stopPropagation()}>
                        <PanelLink
                          className="flex-center list-popover__icon"
                          to={`lists/${list.get('name')}`}
                        >
                          <Icon type="edit" />
                        </PanelLink>
                      </div>
                      <div className="hidden-action flex-center list-popover__icon">
                        <Icon
                          type="delete"
                          onClick={(ev) => {
                              ev.preventDefault();
                              ev.stopPropagation();
                              listDelete(list.get('id'), list.get('name'));
                          }}
                        />
                      </div>
                    </div>
                  );
              })}
            </div>
            <div className="content-link list-popover__button" onClick={this.toggleNewList}>
              <Icon
                className="list-popover__left-item"
                type="plus"
              />
              <div style={{ flex: '1 1 auto' }}>
                {intl.formatMessage(listMessages.createNew)}
              </div>
            </div>
          </div>
        );
    }
}

PopoverSelectableList.propTypes = {
    entryId: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
    listDelete: PropTypes.func.isRequired,
    lists: PropTypes.shape().isRequired,
    listSearch: PropTypes.func.isRequired,
    listToggleEntry: PropTypes.func.isRequired,
    search: PropTypes.string,
};

export default injectIntl(PopoverSelectableList);
