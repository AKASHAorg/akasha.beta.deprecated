import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Popover, Modal } from 'antd';
import fuzzy from 'fuzzy';
import { injectIntl } from 'react-intl';
import { EntrySecondarySidebarItem, Icon } from '../';
import { entryMessages, generalMessages, searchMessages } from '../../locale-data/messages';
import { entryTypes, entryTypesIcons } from '../../constants/entry-types';
import { draftsGetCount, draftsGet, draftDelete, draftCreate,
    draftResetIterator, draftRevertToVersion } from '../../local-flux/actions/draft-actions';
import { entryProfileIterator, entryGetFull } from '../../local-flux/actions/entry-actions';
import { tagCanCreate } from '../../local-flux/actions/tag-actions';
import { selectLoggedEthAddress } from '../../local-flux/selectors/profile-selectors';
import { selectDraftsList, selectDraftsCount, selectDraftsFetched, selectDrafts, selectDraftsResolvingEntries,
    getDraftsMoreEntries, getUserDefaultLicence } from '../../local-flux/selectors';

const { confirm } = Modal;
const shallowEquals = (a, b) => Object.keys(a).every(key => a[key] === b[key]);

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
        this.props.tagCanCreate({ ethAddress });
        this.entryProfileIterator();
    }
    /* eslint-disable complexity */
    shouldComponentUpdate (nextProps, nextState) {
        const draftId = nextProps.match.params.draftId;
        const draftTitle = nextProps.drafts.getIn([draftId, 'content', 'title']);
        const draftCardTitle = nextProps.drafts.getIn([draftId, 'content', 'cardInfo', 'title']);

        return (nextProps.draftsFetched !== this.props.draftsFetched) ||
            !nextProps.draftList.equals(this.props.draftList) ||
            !nextProps.drafts.equals(this.props.drafts) ||
            nextProps.moreEntries !== this.props.moreEntries ||
            (nextProps.match.params.draftType !== this.props.match.params.draftType) ||
            (draftId !== this.props.match.params.draftId) ||
            (draftTitle !== this.props.drafts.getIn([draftId, 'content', 'title'])) ||
            (draftCardTitle !== this.props.drafts.getIn([draftId, 'content', 'cardInfo', 'title'])) ||
            nextProps.drafts.getIn([nextProps.match.params.draftId, 'localChanges']) !==
                this.props.drafts.getIn([this.props.match.params.draftId, 'localChanges']) ||
            !nextProps.resolvingEntries.equals(this.props.resolvingEntries) ||
            !shallowEquals(nextState, this.state);
    }
    /* eslint-enable complexity */

    entryProfileIterator = () => {
        const { ethAddress } = this.props;
        const { selectedEntryFilter } = this.state;
        const entryType = selectedEntryFilter === 'all' ?
            undefined :
            entryTypes.indexOf(selectedEntryFilter);
        this.props.entryProfileIterator({
            id: null,
            value: ethAddress,
            limit: 5,
            asDrafts: true,
            entryType
        });
    };

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
    };

    _handleDraftDelete = (draftIdToDelete) => {
        const { ethAddress, draftList, drafts, match, history } = this.props;
        const { draftType, draftId } = match.params;

        const nextDraftId = draftList.filter(id => !drafts.getIn([id, 'onChain']) && id !== draftId).first();

        this.props.draftDelete({
            draftId: draftIdToDelete,
            ethAddress
        });
        if (nextDraftId && draftIdToDelete === draftId) {
            history.push(`/draft/${draftType}/${nextDraftId}`);
        } else if (!nextDraftId) {
            history.push(`/draft/${draftType}/nodraft`);
        }
    };

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
    };

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
    };

    _handleTypeChange = (type, category) =>
        (ev) => {
            ev.preventDefault();
            if (category === 'draft') {
                return this.setState({
                    selectedDraftFilter: type,
                    draftTypeVisible: false,
                });
            }
            const callback = type === 'all' ?
                undefined :
                () => { this.entryProfileIterator(); this.props.draftResetIterator(); };
            return this.setState({
                selectedEntryFilter: type,
                entryTypeVisible: false
            }, callback);
        };

    _handleVersionRevert = (draftId, version) => {
        const { ethAddress } = this.props;
        this.props.draftRevertToVersion({
            version,
            id: draftId
        });
        this.props.entryGetFull({
            entryId: draftId,
            version,
            asDraft: true,
            revert: true,
            ethAddress,
        });
    };

    _handleDraftRevert = (ev, draftId) => {
        const { drafts, intl } = this.props;
        const draftObj = drafts.get(draftId);
        const draftVersion = draftObj.getIn(['content', 'latestVersion']);
        if (draftObj.localChanges) {
            confirm({
                content: intl.formatMessage(entryMessages.revertConfirmTitle),
                okText: intl.formatMessage(generalMessages.yes),
                okType: 'danger',
                cancelText: intl.formatMessage(generalMessages.no),
                onOk: () => this._handleVersionRevert(draftId, draftVersion),
                onCancel () {}
            });
        } else {
            this._handleVersionRevert(draftId, draftVersion);
        }
    };

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
            <Icon type={(type !== 'all') && entryTypesIcons[type]} />
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
            <Icon type="entries" />
            {intl.formatMessage(entryMessages[`${category}All`])}
          </li>
        );
        return (
          <div>
            <ul className="new-entry-secondary-sidebar__entry-type-list">
              {entries}
            </ul>
          </div>
        );
    };

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
        };

    _createDraftPreviewLink = (ev, draftId) => {
        // prevent default just in case some other dev decides to
        // use <a> tag instead <div>
        if (ev) ev.preventDefault();

        // @TODO this feature is not planned for 0.6 release;
        console.log('create an ipfs preview link for draft', draftId);
        // this.props.createDraftPreviewLink()
    };

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

    _getSearchResults = () => {
        const { drafts } = this.props;
        const searchOptions = {
            pre: '<b>',
            post: '</b>',
            extract: (el) => {
                if (el.content.entryType === 'link') {
                    return el.content.cardInfo.title;
                }
                return el.content.title;
            },
        };
        if (this.state.searching) {
            return fuzzy.filter(this.state.searchString, drafts.toList().toJS(), searchOptions);
        }
        return null;
    };

    _handleSearchBarShortcuts = (ev) => {
        if (ev.key === 'Escape') {
            this.setState({
                searchString: '',
                searching: false,
                searchBarVisible: false
            });
        }
    };
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
        };

    renderPopover = (type) => {
        const visible = type === 'draft' ?
            this.state.draftTypeVisible :
            this.state.entryTypeVisible;
        return (
          <Popover
            arrowPointAtCenter
            content={this.wasVisible ? this._getEntryTypePopover(type) : null}
            trigger="click"
            placement="bottomLeft"
            overlayClassName="new-entry-secondary-sidebar__draft-type-popover"
            overlayStyle={{ width: 190 }}
            visible={visible}
            onVisibleChange={this._forceTypeVisibility(type)}
          >
            <div
              className="flex-center-y content-link"
              onClick={this._handleTypeVisibility(type)}
            >
              <Icon className="content-link" type="arrowDropdownOpen" />
            </div>
          </Popover>
        )
    };

    renderSidebarItem = (draft, matchString) => {
        const { intl, match, resolvingEntries } = this.props;
        const currentDraftId = match.params.draftId;
        return (
          <EntrySecondarySidebarItem
            active={(draft.id === currentDraftId)}
            key={draft.id}
            draft={draft}
            intl={intl}
            matchString={matchString}
            onItemClick={this._onDraftItemClick}
            onDraftDelete={this._showDraftDeleteConfirm}
            showDraftMenuDropdown={this._showDraftMenuDropdown}
            onPreviewCreate={this._createDraftPreviewLink}
            onDraftRevert={this._handleDraftRevert}
            unresolved={resolvingEntries.includes(draft.id)}
          />
        );
    };

    render () { // eslint-disable-line complexity
        const { draftList, drafts, intl, moreEntries } = this.props;
        const { searchBarVisible, searching, searchString } = this.state;
        const draftType = this.state.selectedDraftFilter;
        const entryType = this.state.selectedEntryFilter;
        const localDraftsByType = draftList
            .filter((id) => {
                const drft = drafts.get(id);
                if (draftType === 'all') {
                    return !drft.get('onChain');
                }
                return (!drft.get('onChain') && drft.getIn(['content', 'entryType']) === draftType);
            });

        const publishedDraftsByType = draftList
            .filter((id) => {
                const drft = drafts.get(id);
                if (entryType === 'all') {
                    return drft.get('id') && drft.get('onChain');
                }
                return (drft.get('id') && drft.get('onChain') &&
                    drft.getIn(['content', 'entryType']) === entryType);
            });
        const searchResults = this._getSearchResults();
        return (
          <div className="new-entry-secondary-sidebar">
            <div className="new-entry-secondary-sidebar__sidebar-header">
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
                <Icon type={`${searchBarVisible ? 'close' : 'search'}`} />
              </div>
            </div>
            <div className="new-entry-secondary-sidebar__sidebar-body">
              <div className="new-entry-secondary-sidebar__draft-list-container">
                <div className="new-entry-secondary-sidebar__draft-list-title">
                  <span
                    className="content-link new-entry-secondary-sidebar__draft-list-title-text"
                    onClick={this._handleTypeVisibility('draft')}
                  >
                    {
                      intl.formatMessage(draftType === 'all' ?
                        entryMessages.draftAll :
                        entryMessages[`${draftType}EntryType`]
                      )
                    } {(draftType !== 'all') &&
                      intl.formatMessage(entryMessages.draftEntryCategory)
                    }
                  </span>
                  {this.renderPopover('draft')}
                </div>
                {searching && (searchResults.length > 0) &&
                    searchResults
                        .filter((drft) => {
                            const hasFilter = draftType !== 'all';
                            const filtered = drft.original.content.entryType === draftType;
                            return !drft.original.onChain && (!hasFilter || filtered);
                        })
                        .map(draft => this.renderSidebarItem(draft.original, draft.string))
                }
                {searching && searchResults.length === 0 &&
                  <div>{intl.formatMessage(entryMessages.noDraftsFoundOnSearch)}</div>
                }
                {!searching &&
                  localDraftsByType.map(id => this.renderSidebarItem(drafts.get(id).toJS()))}
                <div>
                  <div className="new-entry-secondary-sidebar__draft-list-title">
                    <span
                      className="content-link new-entry-secondary-sidebar__draft-list-title-text"
                      onClick={this._handleTypeVisibility('published')}
                    >
                      {
                        intl.formatMessage(entryType === 'all' ?
                            entryMessages.entriesAll :
                            entryMessages[`${entryType}EntryType`]
                        )
                      } {(entryType !== 'all') &&
                        intl.formatMessage(entryMessages.publishedEntryCategory)
                      }
                    </span>
                    {this.renderPopover('published')}
                  </div>
                  {!searching &&
                    publishedDraftsByType.map(id => this.renderSidebarItem(drafts.get(id).toJS()))}
                  {!searching && moreEntries &&
                    <div className="flex-center-x">
                      <span
                        className="new-entry-secondary-sidebar__load-more-button"
                        onClick={this.entryProfileIterator}
                      >
                        {intl.formatMessage(generalMessages.loadMore)}
                      </span>
                    </div>
                  }
                  {searching && searchResults
                      .filter((drft) => {
                          const hasFilter = entryType !== 'all';
                          const filtered = drft.original.content.entryType === entryType;
                          return drft.original.onChain && (!hasFilter || filtered);
                      })
                      .map(draft => this.renderSidebarItem(draft.original, draft.string))
                  }
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
    draftCreate: PropTypes.func,
    draftDelete: PropTypes.func,
    draftList: PropTypes.shape().isRequired,
    draftsFetched: PropTypes.bool,
    drafts: PropTypes.shape(),
    draftsGetCount: PropTypes.func,
    draftResetIterator: PropTypes.func.isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    match: PropTypes.shape(),
    moreEntries: PropTypes.bool,
    resolvingEntries: PropTypes.shape(),
    userSelectedLicence: PropTypes.shape(),
    draftRevertToVersion: PropTypes.func,
    entryGetFull: PropTypes.func,
    tagCanCreate: PropTypes.func,
};

const mapStateToProps = state => ({
    draftList: selectDraftsList(state),
    draftsCount: selectDraftsCount(state),
    ethAddress: selectLoggedEthAddress(state),
    draftsFetched: selectDraftsFetched(state),
    drafts: selectDrafts(state),
    moreEntries: getDraftsMoreEntries(state),
    resolvingEntries: selectDraftsResolvingEntries(state),
    userSelectedLicence: getUserDefaultLicence(state),
});

export default connect(
    mapStateToProps,
    {
        draftCreate,
        draftDelete,
        draftsGetCount,
        draftsGet,
        draftResetIterator,
        draftRevertToVersion,
        entryGetFull,
        entryProfileIterator,
        tagCanCreate,
    }
)(injectIntl(NewEntrySecondarySidebar));
