import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Popover, Modal } from 'antd';
import fuzzy from 'fuzzy';
import { injectIntl } from 'react-intl';
import { EntrySecondarySidebarItem } from '../';
import { entryMessages } from '../../locale-data/messages';
import { genId } from '../../utils/dataModule';
import { entryTypes, entryTypesIcons } from '../../constants/entry-types';
import { draftsGetCount, draftsGet, draftDelete, draftCreate } from '../../local-flux/actions/draft-actions';
import { entryProfileIterator } from '../../local-flux/actions/entry-actions';

const { confirm } = Modal;
class NewEntrySecondarySidebar extends Component {
    state = {
        searchString: '',
        draftTypeVisible: false,
        searchBarVisible: false,
        searching: false,
    };

    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.draftsGetCount({ ethAddress });
        this.props.entryProfileIterator({
            column: null,
            ethAddress,
            limit: 0,
            asDrafts: true
        });
    }

    componentWillReceiveProps (nextProps) {
        const { draftsFetched, draftsCount } = nextProps;
        const { ethAddress } = this.props;
        if (!draftsFetched && (draftsCount > 0)) {
            this.props.draftsGet({ ethAddress });
        }
    }

    createNewDraft = (id, entryType) => {
        const { ethAddress, userSelectedLicence } = this.props;
        this.props.draftCreate({
            id,
            ethAddress,
            content: {
                featuredImage: {},
                licence: userSelectedLicence,
            },
            tags: [],
            entryType,
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

    _handleDraftDelete = (draftId) => {
        const { ethAddress } = this.props;
        this.props.draftDelete({ draftId, ethAddress });
    }

    _showDraftDeleteConfirm = (ev, draftId) => {
        const handleDraftDelete = this._handleDraftDelete.bind(null, draftId);
        confirm({
            content: 'Are you sure you want to delete this draft?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
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

    _handleTypeChange = type =>
        (ev) => {
            const { drafts, history } = this.props;
            const draftToPush = drafts.filter(draft => draft.entryType === type).first();
            let draftId;
            /**
             * Push to first draft of the selected type!
             */
            if (draftToPush) {
                draftId = draftToPush.id;
            } else {
                /**
                 * create a new draft and push to it
                 */
                draftId = genId();
                this.createNewDraft(draftId, type);
            }
            this.setState({
                draftTypeVisible: false
            }, () => {
                history.push(`/draft/${type}/${draftId}`);
            });
            ev.preventDefault();
        }

    _handleDraftCreate = () => {
        const draftId = genId();
        const entryType = this.props.match.params.draftType;
        this.createNewDraft(draftId, entryType);
        this.props.history.push(`/draft/${entryType}/${draftId}`);
    }

    _getEntryTypePopover = () => {
        const { intl, match } = this.props;
        const currentType = match.params.draftType;
        return (
          <div>
            <ul
              className="new-entry-secondary-sidebar__entry-type-list"
            >
              {/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */}
              {entryTypes.map(type => (
                <li
                  key={type}
                  className={
                    `new-entry-secondary-sidebar__entry-type
                    new-entry-secondary-sidebar__entry-type${type === currentType ? '_active' : ''}`
                  }
                  onClick={this._handleTypeChange(type)}
                >
                  <Icon
                    type={entryTypesIcons[type]}
                  />
                  {intl.formatMessage(entryMessages[`${type}EntryType`])}
                </li>
                ))}
            </ul>
          </div>
        );
    }

    _handleDraftTypeVisibility = () => {
        this.setState(prevState => ({
            draftTypeVisible: !prevState.draftTypeVisible
        }));
    }

    _createDraftPreviewLink = (ev, draftId) => {
        // prevent default just in case some other dev decides to
        // use <a> tag instead <div>
        if (ev) ev.preventDefault();

        // @TODO this feature is not planned for 0.6 release;
        console.log('create a preview link for draft', draftId);
        // this.props.createDraftPreviewLink()
    }

    _getFilteredDrafts = (drafts, resolvingEntries, draftType) =>
        drafts.filter(draft =>
            draft.entryType === draftType && draft.content && draft.content.title);

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
            extract: el => el.content.title,
        };
        if (this.state.searching) {
            const allDrafts = this._getFilteredDrafts(drafts, resolvingEntries, draftType);
            return fuzzy.filter(this.state.searchString, allDrafts.toList().toJS(), searchOptions);
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
    _forceDraftTypeVisibility = (visible) => {
        this.setState({
            draftTypeVisible: visible
        });
    }

    render () {
        const { drafts, intl, match, resolvingEntries } = this.props;
        const { searchBarVisible, searching, searchString } = this.state;
        const currentDraftId = match.params.draftId;
        const { draftType } = match.params;
        const draftsByType = drafts
            .filter(drft =>
                (!drft.get('onChain') && drft.get('entryType') === draftType))
            .sort((a, b) =>
                new Date(a.get('created_at')) > new Date(b.get('created_at'))
            );
        const searchResults = this._getSearchResults(drafts, resolvingEntries, match.params.draftType);
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
                <Popover
                  content={this._getEntryTypePopover()}
                  trigger="click"
                  placement="bottomLeft"
                  overlayClassName="new-entry-secondary-sidebar__draft-type-popover"
                  visible={this.state.draftTypeVisible}
                  onVisibleChange={this._forceDraftTypeVisibility}
                >
                  <div
                    onClick={this._handleDraftTypeVisibility}
                  >{intl.formatMessage(entryMessages[`${draftType}EntryType`])} <Icon type="down" /></div>
                </Popover>
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
                  placeholder={intl.formatMessage(entryMessages.searchSomething)}
                  onChange={this._handleDraftSearch}
                  onKeyDown={this._handleSearchBarShortcuts}
                  value={searchString}
                />
              </div>
              <div
                className="new-entry-secondary-sidebar__sidebar-header_search-icon"
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
                  <div>{intl.formatMessage(entryMessages.drafts)}</div>
                  <Icon type="plus" onClick={this._handleDraftCreate} />
                </div>
                {searching && (searchResults.length > 0) &&
                    searchResults
                        .filter(drft => !drft.original.onChain)
                        .map(draft => (
                          <EntrySecondarySidebarItem
                            active={(draft.original.id === currentDraftId)}
                            key={draft.original.id}
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
                  <div>No drafts matching your search criteria were found.</div>
                }
                {!searching &&
                    draftsByType.map(draft => (
                      <EntrySecondarySidebarItem
                        active={(draft.get('id') === currentDraftId)}
                        key={draft.get('id')}
                        draft={draft.toJS()}
                        intl={intl}
                        onItemClick={this._onDraftItemClick}
                        onDraftDelete={this._showDraftDeleteConfirm}
                        showDraftMenuDropdown={this._showDraftMenuDropdown}
                        onPreviewCreate={this._createDraftPreviewLink}
                      />
                    )).toList()}
                <div>
                  <div className="new-entry-secondary-sidebar__draft-list-title">Published</div>
                  {!searching &&
                    drafts.filter(drft =>
                        drft.get('onChain') && drft.get('entryType') === draftType)
                    .map(draft => (
                      <div key={`${draft.get('id')}`}>
                        <EntrySecondarySidebarItem
                          active={(draft.get('id') === currentDraftId)}
                          key={draft.get('id')}
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
                      drft.original.onChain && drft.original.entryType === draftType)
                      .map(draft => (
                        <EntrySecondarySidebarItem
                          active={(draft.original.id === currentDraftId)}
                          key={draft.original.id}
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
                    <div>No drafts matching your search criteria were found.</div>
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
