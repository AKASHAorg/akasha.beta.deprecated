import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Popover, Modal } from 'antd';
import fuzzy from 'fuzzy';
import { injectIntl } from 'react-intl';
import { EntrySecondarySidebarItem, Icon } from '../';
import { entryMessages, searchMessages } from '../../locale-data/messages';
import { genId } from '../../utils/dataModule';
import { entryTypes, entryTypesIcons } from '../../constants/entry-types';
import { draftsGetCount, draftsGet, draftDelete, draftCreate } from '../../local-flux/actions/draft-actions';
import { entryProfileIterator } from '../../local-flux/actions/entry-actions';
import { generalMessages } from '../../locale-data/messages/general-messages';

const { confirm } = Modal;
class NewEntrySecondarySidebar extends Component {
    state = {
        searchString: '',
        draftTypeVisible: false,
        entryTypeVisible: false,
        searchBarVisible: false,
        searching: false,
        selectedDraftFilter: 'all',
        selectedEntryFilter: 'all',
    };
    wasVisible = false;

    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.draftsGetCount({ ethAddress });
        this.props.entryProfileIterator({
            column: null,
            value: ethAddress,
            limit: 1000000,
            asDrafts: true
        });
    }
    /* eslint-disable complexity */
    shouldComponentUpdate (nextProps, nextState) {
        const draftId = nextProps.match.params.draftId;
        const draftTitle = nextProps.drafts.getIn([draftId, 'content', 'title']);
        const draftCardTitle = nextProps.drafts.getIn([draftId, 'content', 'cardInfo', 'title']);

        return (nextProps.draftsFetched !== this.props.draftsFetched) ||
            (nextProps.drafts.size !== this.props.drafts.size) ||
            (nextProps.match.params.draftType !== this.props.match.params.draftType) ||
            (draftId !== this.props.match.params.draftId) ||
            (draftTitle !== this.props.drafts.getIn([draftId, 'content', 'title'])) ||
            (draftCardTitle !== this.props.drafts.getIn([draftId, 'content', 'cardInfo', 'title'])) ||
            nextProps.drafts.getIn([nextProps.match.params.draftId, 'localChanges']) !==
                this.props.drafts.getIn([this.props.match.params.draftId, 'localChanges']) ||
            !nextProps.resolvingEntries.equals(this.props.resolvingEntries) ||
            (nextState.searchString !== this.state.searchString) ||
            (nextState.searching !== this.state.searching) ||
            (nextState.draftTypeVisible !== this.state.draftTypeVisible) ||
            (nextState.entryTypeVisible !== this.state.entryTypeVisible) ||
            (nextState.searchBarVisible !== this.state.searchBarVisible) ||
            (nextState.selectedDraftFilter !== this.state.selectedDraftFilter) ||
            (nextState.selectedEntryFilter !== this.state.selectedEntryFilter);
    }
    /* eslint-enable complexity */

    createNewDraft = (id, entryType) => {
        const { ethAddress, userSelectedLicence } = this.props;
        this.props.draftCreate({
            id,
            ethAddress,
            content: {
                featuredImage: {},
                licence: userSelectedLicence,
                entryType,
            },
            tags: [],
        });
    }

    _onDraftItemClick = (ev, draftPath) => {
        ev.preventDefault();
        const { history } = this.props;
        this.setState({
            searchString: '',
            searchBarVisible: false,
            searching: false,
            draftTypeVisible: false
        }, () => {
            history.push(draftPath);
        });
    }

    _handleDraftDelete = (draftIdToDelete) => {
        const { ethAddress, drafts, match, history } = this.props;
        const { draftType, draftId } = match.params;

        const nextDraft = drafts.filter(draft => !draft.get('onChain') &&
            draft.getIn(['content', 'entryType']) === draftType && draft.get('id') !== draftId).first();

        this.props.draftDelete({
            draftId: draftIdToDelete,
            ethAddress
        });
        if (nextDraft && draftIdToDelete === draftId) {
            history.push(`/draft/${draftType}/${nextDraft.get('id')}`);
        } else if (!nextDraft) {
            history.push(`/draft/${draftType}/nodraft`);
        }
    }

    _showDraftDeleteConfirm = (ev, draftId) => {
        const { intl } = this.props;
        const handleDraftDelete = this._handleDraftDelete.bind(null, draftId);
        confirm({
            content: intl.formatMessage(entryMessages.draftDeleteConfirmation),
            okText: intl.formatMessage(generalMessages.yes),
            okType: 'danger',
            cancelText: intl.formatMessage(generalMessages.no),
            onOk: handleDraftDelete,
            onCancel () {}
        });
        ev.preventDefault();
    }

    _handleDraftSearch = (ev) => {
        ev.preventDefault();
        const searchString = ev.target.value;
        if (searchString.length) {
            return this.setState({
                searchString,
                searching: true
            });
        }
        return this.setState({
            searchString,
            searching: false
        });
    }

    _handleTypeChange = (type, category) =>
        (ev) => {
            ev.preventDefault();
            if (category === 'draft') {
                return this.setState({
                    selectedDraftFilter: type,
                    draftTypeVisible: false,
                });
            }
            return this.setState({
                selectedEntryFilter: type,
                entryTypeVisible: false
            });
        }

    _handleDraftCreate = () => {
        const draftId = genId();
        const entryType = this.props.match.params.draftType;
        this.createNewDraft(draftId, entryType);
        this.props.history.push(`/draft/${entryType}/${draftId}`);
    }
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions, indent */
    _getEntryTypePopover = (category) => {
        const { intl } = this.props;
        const { selectedDraftFilter, selectedEntryFilter } = this.state;
        const currentType = category === 'published' ? selectedEntryFilter : selectedDraftFilter;
        const entries = entryTypes.map(type => (
          <li
            key={type}
            className={
              `new-entry-secondary-sidebar__entry-type
              new-entry-secondary-sidebar__entry-type${type === currentType ? '_active' : ''}`
            }
            onClick={this._handleTypeChange(type, category)}
          >
            <Icon
              type={(type !== 'all') && entryTypesIcons[type]}
            />
            {
                intl.formatMessage(entryMessages[`${type}EntryType`])
            } {
                intl.formatMessage(entryMessages[`${category}EntryCategory`])
            }
          </li>
        ));
        entries.unshift(
          <li
            key="all"
            className={
                `new-entry-secondary-sidebar__entry-type
                new-entry-secondary-sidebar__entry-type${currentType === 'all' ? '_active' : ''}`
            }
            onClick={this._handleTypeChange('all', category)}
          >
            <Icon
              type="entries"
            />
            {intl.formatMessage(entryMessages[`${category}All`])}
          </li>
        );
        return (
          <div>
            <ul className="new-entry-secondary-sidebar__entry-type-list">
              {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
              {entries}
            </ul>
          </div>
        );
    }

    _handleTypeVisibility = type =>
        () => {
            this.setState((prevState) => {
                if (type === 'draft') {
                    return {
                        draftTypeVisible: !prevState.draftTypeVisible
                    };
                }
                return {
                    entryTypeVisible: !prevState.entryTypeVisible
                };
            });
        }

    _createDraftPreviewLink = (ev, draftId) => {
        // prevent default just in case some other dev decides to
        // use <a> tag instead <div>
        if (ev) ev.preventDefault();

        // @TODO this feature is not planned for 0.6 release;
        console.log('create an ipfs preview link for draft', draftId);
        // this.props.createDraftPreviewLink()
    }

    _getFilteredDrafts = (drafts, resolvingEntries, draftType) =>
        drafts.filter((draft) => {
            if (draftType === 'all') {
                return draft;
            }
            if (draftType === 'link') {
                return draft.content && draft.content.entryType === draftType && draft.content.cardInfo.title;
            }
            return draft.content && draft.content.entryType === draftType && draft.content.title;
        })

    _toggleSearchBarVisibility = (ev) => {
        ev.preventDefault();
        this.setState((prevState) => {
            if (!prevState.searchBarVisible) {
                this.searchInput.focus();
            }
            if (prevState.searchBarVisible) {
                return {
                    searchBarVisible: false,
                    draftTypeVisible: false,
                    searchString: '',
                    searching: false
                };
            }
            return {
                searchBarVisible: !prevState.searchBarVisible,
                draftTypeVisible: false,
            };
        });
    };

    _getSearchResults = (drafts, resolvingEntries, draftType) => {
        const searchOptions = {
            pre: '<b>',
            post: '</b>',
            extract: (el) => {
                if (draftType === 'link') {
                    return el.content.cardInfo.title;
                }
                return el.content.title;
            },
        };
        if (this.state.searching) {
            // const allDrafts = this._getFilteredDrafts(drafts, resolvingEntries, draftType);
            return fuzzy.filter(this.state.searchString, drafts.toList().toJS(), searchOptions);
        }
        return null;
    }

    _handleSearchBarShortcuts = (ev) => {
        if (ev.which === 27) {
            this.setState({
                searchString: '',
                searching: false,
                searchBarVisible: false
            });
        }
    }
    /**
     * for events like clicking outside of the popover component
     */
    _forceTypeVisibility = type =>
        (visible) => {
            this.wasVisible = true;
            this.setState(() => {
                if (type === 'draft') {
                    return {
                        draftTypeVisible: visible
                    };
                }
                return {
                    entryTypeVisible: visible
                };
            });
        }

    render () {
        const { drafts, intl, match, resolvingEntries } = this.props;
        const { searchBarVisible, searching, searchString } = this.state;
        const currentDraftId = match.params.draftId;
        const draftType = this.state.selectedDraftFilter;
        const entryType = this.state.selectedEntryFilter;

        const localDraftsByType = drafts
            .filter((drft) => {
                if (draftType === 'all') {
                    return !drft.get('onChain');
                }
                return (!drft.get('onChain') && drft.getIn(['content', 'entryType']) === draftType);
            })
            .sort((a, b) =>
                new Date(a.get('created_at')) > new Date(b.get('created_at'))
            );
        const publishedDraftsByType = drafts.filter((drft) => {
            if (entryType === 'all') {
                return drft.get('id') && drft.get('onChain');
            }
            return (drft.get('id') && drft.get('onChain') &&
                drft.getIn(['content', 'entryType']) === entryType);
        });
        const searchResults = this._getSearchResults(drafts, resolvingEntries, 'all');
        return (
          <div
            className="new-entry-secondary-sidebar"
          >
            <div
              className="new-entry-secondary-sidebar__sidebar-header"
            >
              <div
                className={
                  `new-entry-secondary-sidebar__sidebar-header_dropdown-container
                   new-entry-secondary-sidebar__sidebar-header_dropdown-container${
                       searchBarVisible ? '-hidden' : ''
                  }`
                }
              >
                <div>{intl.formatMessage(entryMessages.myEntries)}</div>
              </div>
              <div
                className={
                    `new-entry-secondary-sidebar__search-container
                    new-entry-secondary-sidebar__search-container${searchBarVisible ? '_visible' : ''}`
                }
              >
                <input
                  type="text"
                  ref={(node) => { this.searchInput = node; }}
                  className="new-entry-secondary-sidebar__search-field"
                  placeholder={intl.formatMessage(searchMessages.searchSomething)}
                  onChange={this._handleDraftSearch}
                  onKeyDown={this._handleSearchBarShortcuts}
                  value={searchString}
                />
              </div>
              <div
                className="flex-center new-entry-secondary-sidebar__sidebar-header_search-icon"
                onClick={this._toggleSearchBarVisibility}
              >
                <Icon
                  type={`${searchBarVisible ? 'close' : 'search'}`}
                />
              </div>
            </div>
            <div
              className="new-entry-secondary-sidebar__sidebar-body"
            >
              <div
                className="new-entry-secondary-sidebar__draft-list-container"
              >
                <div className="new-entry-secondary-sidebar__draft-list-title">
                  <span
                    className="content-link new-entry-secondary-sidebar__draft-list-title-text"
                    onClick={this._handleTypeVisibility('draft')}
                  >
                    {draftType === 'all' && intl.formatMessage(entryMessages.draftAll)}
                    {
                        (draftType !== 'all') && intl.formatMessage(entryMessages[`${draftType}EntryType`])
                    } {
                       intl.formatMessage(entryMessages.draftEntryCategory)
                    }
                  </span>
                  <Popover
                    arrowPointAtCenter
                    content={this.wasVisible ? this._getEntryTypePopover('draft') : null}
                    trigger="click"
                    placement="bottomLeft"
                    overlayClassName="new-entry-secondary-sidebar__draft-type-popover"
                    overlayStyle={{ width: 190 }}
                    visible={this.state.draftTypeVisible}
                    onVisibleChange={this._forceTypeVisibility('draft')}
                  >
                    <div
                      className="flex-center-y content-link"
                      onClick={this._handleTypeVisibility('draft')}
                    >
                      <Icon
                        className="content-link"
                        type="arrowDropdownOpen"
                      />
                    </div>
                  </Popover>
                </div>
                {searching && (searchResults.length > 0) &&
                    searchResults
                        .filter(drft => !drft.original.onChain)
                        .map(draft => (
                          <EntrySecondarySidebarItem
                            active={(draft.original.id === currentDraftId)}
                            key={`${draft.original.id}`}
                            draft={draft.original}
                            matchString={draft.string}
                            intl={intl}
                            onItemClick={this._onDraftItemClick}
                            onDraftDelete={this._showDraftDeleteConfirm}
                            showDraftMenuDropdown={this._showDraftMenuDropdown}
                            onPreviewCreate={this._createDraftPreviewLink}
                          />
                        ))
                }
                {searching && searchResults.length === 0 &&
                  <div>{intl.formatMessage(entryMessages.noDraftsFoundOnSearch)}</div>
                }
                {!searching &&
                    localDraftsByType.map(draft => (
                      <EntrySecondarySidebarItem
                        active={(draft.get('id') === currentDraftId)}
                        key={`${draft.get('id')}`}
                        draft={draft.toJS()}
                        intl={intl}
                        onItemClick={this._onDraftItemClick}
                        onDraftDelete={this._showDraftDeleteConfirm}
                        showDraftMenuDropdown={this._showDraftMenuDropdown}
                        onPreviewCreate={this._createDraftPreviewLink}
                      />
                    )).toList()}
                <div>
                  <div className="new-entry-secondary-sidebar__draft-list-title">
                    <span
                      className="content-link new-entry-secondary-sidebar__draft-list-title-text"
                      onClick={this._handleTypeVisibility('published')}
                    >
                      {entryType === 'all' && intl.formatMessage(entryMessages.entriesAll)}
                      {
                          entryType !== 'all' && intl.formatMessage(entryMessages[`${entryType}EntryType`])
                      } {
                        intl.formatMessage(entryMessages.publishedEntryCategory)
                      }
                    </span>
                    <Popover
                      arrowPointAtCenter
                      content={this.wasVisible ? this._getEntryTypePopover('published') : null}
                      trigger="click"
                      placement="bottomLeft"
                      overlayClassName="new-entry-secondary-sidebar__draft-type-popover"
                      overlayStyle={{ width: 190 }}
                      visible={this.state.entryTypeVisible}
                      onVisibleChange={this._forceTypeVisibility('published')}
                    >
                      <div
                        className="flex-center-y content-link"
                        onClick={this._handleTypeVisibility('published')}
                      >
                        <Icon
                          className="content-link"
                          type="arrowDropdownOpen"
                        />
                      </div>
                    </Popover>
                  </div>
                  {!searching && publishedDraftsByType.map(draft => (
                    <div key={`${draft.get('id')}`}>
                      <EntrySecondarySidebarItem
                        active={(draft.get('id') === currentDraftId)}
                        key={`${draft.get('id')}`}
                        draft={draft.toJS()}
                        intl={intl}
                        onItemClick={this._onDraftItemClick}
                        onDraftDelete={this._showDraftDeleteConfirm}
                        showDraftMenuDropdown={this._showDraftMenuDropdown}
                        onPreviewCreate={this._createDraftPreviewLink}
                        published={draft.get('onChain')}
                        localChanges={draft.get('localChanges')}
                        unresolved={resolvingEntries.includes(draft.get('id'))}
                      />
                    </div>
                  )).toList()}
                  {searching && searchResults.filter(drft =>
                      drft.original.onChain)
                      .map(draft => (
                        <EntrySecondarySidebarItem
                          active={(draft.original.id === currentDraftId)}
                          key={`${draft.original.id}`}
                          draft={draft.original}
                          intl={intl}
                          matchString={draft.string}
                          onItemClick={this._onDraftItemClick}
                          onDraftDelete={this._showDraftDeleteConfirm}
                          showDraftMenuDropdown={this._showDraftMenuDropdown}
                          onPreviewCreate={this._createDraftPreviewLink}
                          published={draft.original.onChain}
                          localChanges={draft.original.localChanges}
                          unresolved={resolvingEntries.includes(draft.original.id)}
                        />
                  ))}
                  {searching && searchResults.length === 0 &&
                    <div>{intl.formatMessage(entryMessages.noDraftsFoundOnSearch)}</div>
                  }
                </div>
              </div>
            </div>
          </div>
        );
    }
}
NewEntrySecondarySidebar.propTypes = {
    ethAddress: PropTypes.string,
    draftsCount: PropTypes.number,
    draftCreate: PropTypes.func,
    draftDelete: PropTypes.func,
    draftsFetched: PropTypes.bool,
    drafts: PropTypes.shape(),
    draftsGet: PropTypes.func,
    draftsGetCount: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    match: PropTypes.shape(),
    resolvingEntries: PropTypes.shape(),
    userSelectedLicence: PropTypes.shape(),
};
const mapStateToProps = state => ({
    draftsCount: state.draftState.get('draftsCount'),
    ethAddress: state.profileState.getIn(['loggedProfile', 'ethAddress']),
    draftsFetched: state.draftState.get('draftsFetched'),
    drafts: state.draftState.get('drafts'),
    resolvingEntries: state.draftState.get('resolvingEntries'),
    userSelectedLicence: state.settingsState.getIn(['userSettings', 'defaultLicence']),
});

export default connect(
    mapStateToProps,
    {
        draftCreate,
        draftDelete,
        draftsGetCount,
        draftsGet,
        entryProfileIterator,
    }
)(injectIntl(NewEntrySecondarySidebar));
