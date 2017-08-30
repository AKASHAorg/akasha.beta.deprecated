import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { List } from 'immutable';
import { Checkbox, Icon, Input, Popover } from 'antd';
import { NewListForm, PanelLink } from '../';
import { EntryBookmarkOff } from '../svg';
import { generalMessages, listMessages } from '../../locale-data/messages';

class ListPopover extends Component {
    constructor (props) {
        super(props);
        this.initialEntryLists = this.getEntryLists(props.lists);
        this.state = {
            addNewList: false,
            entryLists: this.initialEntryLists,
            popoverVisible: false,
        };
    }

    componentWillReceiveProps (nextProps) {
        const { lists, updatingLists } = nextProps;
        if (!updatingLists && this.props.updatingLists) {
            this.initialEntryLists = this.getEntryLists(lists);
            this.setState({
                addNewList: false,
                entryLists: this.initialEntryLists,
                popoverVisible: false
            });
        }
        if (!lists.equals(this.props.lists)) {
            this.initialEntryLists = this.getEntryLists(lists);
            this.setState({
                entryLists: this.initialEntryLists
            });
        }
    }

    getSearchInputRef = (el) => { this.searchInput = el; };

    getEntryLists = (lists) => {
        const result = lists
            .filter(list => list.get('entryIds').includes(this.props.entryId))
            .map(list => list.get('name'))
            .toList();
        return result;
    };

    isSaved = (listName) => {
        const { entryLists } = this.state;
        return entryLists.includes(listName);
    };

    isListDirty = () => !this.initialEntryLists.equals(this.state.entryLists);

    groupByState = (lists) => {
        let saved = new List();
        let unsaved = new List();
        lists.forEach((list) => {
            const listName = list.get('name');
            if (this.isSaved(listName)) {
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

    onVisibleChange = (popoverVisible) => {
        if (popoverVisible) {
            this.setInputFocusAsync();
        }
        this.setState({
            popoverVisible
        });
        if (!popoverVisible) {
            // Delay state reset until popover animation is finished
            setTimeout(() => {
                this.searchList('');
                this.setState({
                    addNewList: false,
                    entryLists: this.initialEntryLists
                });
            }, 100);
        }
    };

    setInputFocusAsync = () => {
        setTimeout(() => {
            const input = document.getElementById('list-popover-search');
            if (input) {
                input.focus();
            }
        }, 100);
    };

    searchList = search => this.props.listSearch(search);

    listUpdateEntryIds = () => {
        const { entryId, listUpdateEntryIds } = this.props;
        listUpdateEntryIds(this.state.entryLists.toJS(), entryId);
    };

    toggleList = (listName) => {
        const { entryLists } = this.state;
        let newEntryLists;
        const index = entryLists.indexOf(listName);
        if (index !== -1) {
            newEntryLists = entryLists.delete(index);
        } else {
            newEntryLists = entryLists.push(listName);
        }
        this.setState({
            entryLists: newEntryLists
        });
    };

    toggleNewList = () => {
        if (this.state.addNewList) {
            this.setInputFocusAsync();
        }
        this.setState({
            addNewList: !this.state.addNewList
        });
    };

    renderContent = () => {
        const { entryId, intl, listAdd, listDelete, lists, search } = this.props;

        if (this.state.addNewList) {
            return (
              <NewListForm
                entryId={entryId}
                lists={lists}
                onSave={listAdd}
                onCancel={this.toggleNewList}
              />
            );
        }

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
                  const toggleList = () => this.toggleList(list.get('name'));
                  const isSaved = this.isSaved(list.get('name'));
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
            {this.isListDirty() ?
              <div className="content-link list-popover__button" onClick={this.listUpdateEntryIds}>
                <Icon
                  className="list-popover__left-item"
                  style={{ position: 'relative', top: '2px' }}
                  type="save"
                />
                <div style={{ flex: '1 1 auto' }}>
                  {intl.formatMessage(generalMessages.submit)}
                </div>
              </div> :
              <div className="content-link list-popover__button" onClick={this.toggleNewList}>
                <Icon
                  className="list-popover__left-item"
                  type="plus"
                />
                <div style={{ flex: '1 1 auto' }}>
                  {intl.formatMessage(listMessages.createNew)}
                </div>
              </div>
            }
          </div>
        );
    };

    render () {
        const { containerRef } = this.props;

        return (
          <Popover
            content={this.renderContent()}
            getPopupContainer={() => containerRef}
            onVisibleChange={this.onVisibleChange}
            overlayClassName="list-popover"
            placement="bottom"
            trigger="click"
            visible={this.state.popoverVisible}
          >
            <svg style={{ width: '24px', height: '24px' }} viewBox="0 0 20 20">
              <EntryBookmarkOff />
            </svg>
          </Popover>
        );
    }
}

ListPopover.propTypes = {
    containerRef: PropTypes.shape(),
    entryId: PropTypes.string.isRequired,
    intl: PropTypes.shape().isRequired,
    listAdd: PropTypes.func.isRequired,
    listDelete: PropTypes.func.isRequired,
    lists: PropTypes.shape().isRequired,
    listSearch: PropTypes.func.isRequired,
    listUpdateEntryIds: PropTypes.func.isRequired,
    search: PropTypes.string,
    updatingLists: PropTypes.bool
};

export default injectIntl(ListPopover);
