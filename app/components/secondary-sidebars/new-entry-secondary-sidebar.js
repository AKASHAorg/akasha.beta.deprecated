import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Icon, Popover } from 'antd';
import fuzzy from 'fuzzy';
import { injectIntl } from 'react-intl';
import { EntrySecondarySidebarItem } from '../';
import { entryMessages } from '../../locale-data/messages';
import { selectLoggedAkashaId } from '../../local-flux/selectors';
import { draftsGetCount, draftsGet, draftDelete } from '../../local-flux/actions/draft-actions';
import { entryProfileIterator } from '../../local-flux/actions/entry-actions';

class NewEntrySecondarySidebar extends Component {
    state = {
        searchString: ''
    };

    componentDidMount () {
        const { akashaId } = this.props;
        this.props.draftsGetCount({ akashaId });
        this.props.entryProfileIterator({
            column: null,
            akashaId,
            limit: 0,
            asDrafts: true
        });
    }

    componentWillReceiveProps (nextProps) {
        const { draftsFetched, draftsCount } = nextProps;
        const { akashaId } = this.props;
        if (!draftsFetched && (draftsCount > 0)) {
            this.props.draftsGet({ akashaId });
        }
    }

    _onDraftItemClick = (ev, draftPath) => {
        ev.preventDefault();
        const { history } = this.props;
        history.push(draftPath);
    }

    _handleDraftDelete = (ev, draftId) => {
        const { akashaId } = this.props;
        // prevent default just in case some other dev decides to
        // use <a> tag instead <div>
        if (ev) ev.preventDefault();
        this.props.draftDelete({ draftId, akashaId });
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

    _createDraftPreviewLink = (ev, draftId) => {
        // prevent default just in case some other dev decides to
        // use <a> tag instead <div>
        if (ev) ev.preventDefault();

        // @TODO this feature is not planned for 0.6 release;
        console.log('create a preview link for draft', draftId);
        // this.props.createDraftPreviewLink()
    }

    _getFilteredDrafts = (drafts, resolvingHashes, draftType) =>
        drafts.filter((draft) => {
            const isPublished = !!(draft.entryEth && draft.entryEth.ipfsHash);
            return draft.type === draftType &&
                (isPublished ? draft.content && draft.content.title : true);
        });

    _getSearchResults = (drafts, resolvingHashes, draftType) => {
        const searchOptions = {
            pre: '<b>',
            post: '</b>',
            extract: el => el.content.title,
        };
        if (this.state.searching) {
            const allDrafts = this._getFilteredDrafts(drafts, resolvingHashes, draftType);
            return fuzzy.filter(this.state.searchString, allDrafts.toList().toJS(), searchOptions);
        }
        return null;
    }

    render () {
        const { draftsCount, drafts, intl, match, resolvingHashes } = this.props;
        const currentDraftId = match.params.draftId;
        const searchResults = this._getSearchResults(drafts, resolvingHashes, match.params.draftType);

        return (
          <div
            className="new-entry-secondary-sidebar"
          >
            <div
              className="new-entry-secondary-sidebar__sidebar-header"
            >
              <div>DropDown</div>
              <div>Search Icon</div>
              {intl.formatMessage(entryMessages.draftsCount, { count: draftsCount })}
            </div>
            <div
              className="new-entry-secondary-sidebar__sidebar-body"
            >
              <div
                className="new-entry-secondary-sidebar__search-container"
              >
                <input
                  type="text"
                  className="new-entry-secondary-sidebar__search-field"
                  placeholder={intl.formatMessage(entryMessages.searchSomething)}
                  onChange={this._handleDraftSearch}
                />
              </div>
              <div
                className="new-entry-secondary-sidebar__draft-list-container"
              >
                <div className="new-entry-secondary-sidebar__draft-list-title">
                  {intl.formatMessage(entryMessages.drafts)}
                </div>
                {this.state.searching && (searchResults.length > 0) &&
                    searchResults
                        .filter(drft => !drft.original.active)
                        .map(draft => (
                          <EntrySecondarySidebarItem
                            active={(draft.original.id === currentDraftId)}
                            key={draft.original.id}
                            draft={draft.original}
                            matchString={draft.string}
                            intl={intl}
                            onItemClick={this._onDraftItemClick}
                            onDraftDelete={this._handleDraftDelete}
                            showDraftMenuDropdown={this._showDraftMenuDropdown}
                            onPreviewCreate={this._createDraftPreviewLink}
                          />
                        ))
                }
                {this.state.searching && searchResults.length === 0 &&
                  <div>No drafts matching your search criteria were found.</div>
                }
                {!this.state.searching && drafts.filter(drft => !drft.active).map(draft => (
                  <EntrySecondarySidebarItem
                    active={(draft.id === currentDraftId)}
                    key={draft.id}
                    draft={draft}
                    intl={intl}
                    onItemClick={this._onDraftItemClick}
                    onDraftDelete={this._handleDraftDelete}
                    showDraftMenuDropdown={this._showDraftMenuDropdown}
                    onPreviewCreate={this._createDraftPreviewLink}
                  />
                )).toList()}
                <div>
                  <div className="new-entry-secondary-sidebar__draft-list-title">Published</div>
                  {!this.state.searching &&
                    drafts.filter(drft =>
                        drft.active && drft.id && drft.type === match.params.draftType)
                    .map(draft => (
                      <div key={`${draft.id}`}>
                        {!draft.content &&
                          <div>No content draft</div>
                        }
                        {draft.content &&
                          <EntrySecondarySidebarItem
                            active={(draft.id === currentDraftId)}
                            key={draft.id}
                            draft={draft}
                            intl={intl}
                            onItemClick={this._onDraftItemClick}
                            onDraftDelete={this._handleDraftDelete}
                            showDraftMenuDropdown={this._showDraftMenuDropdown}
                            onPreviewCreate={this._createDraftPreviewLink}
                          />
                        }
                      </div>
                  )).toList()}
                  {this.state.searching && searchResults.filter(drft => drft.original.active).map(draft => (
                    <EntrySecondarySidebarItem
                      active={(draft.original.id === currentDraftId)}
                      key={draft.original.id}
                      draft={draft.original}
                      intl={intl}
                      matchString={draft.string}
                      onItemClick={this._onDraftItemClick}
                      onDraftDelete={this._handleDraftDelete}
                      showDraftMenuDropdown={this._showDraftMenuDropdown}
                      onPreviewCreate={this._createDraftPreviewLink}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
    }
}
NewEntrySecondarySidebar.propTypes = {
    akashaId: PropTypes.string,
    draftsCount: PropTypes.number,
    draftDelete: PropTypes.func,
    draftsFetched: PropTypes.bool,
    drafts: PropTypes.shape(),
    draftsGet: PropTypes.func,
    draftsGetCount: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    match: PropTypes.shape(),
    resolvingHashes: PropTypes.shape(),
};
const mapStateToProps = state => ({
    draftsCount: state.draftState.get('draftsCount'),
    akashaId: selectLoggedAkashaId(state),
    draftsFetched: state.draftState.get('draftsFetched'),
    drafts: state.draftState.get('drafts'),
    resolvingHashes: state.draftState.get('resolvingHashes'),
});

export default connect(
    mapStateToProps,
    {
        draftDelete,
        draftsGetCount,
        draftsGet,
        entryProfileIterator,
    }
)(injectIntl(NewEntrySecondarySidebar));
