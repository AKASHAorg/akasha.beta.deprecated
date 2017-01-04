import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { DataLoader, EntryCard, EntryListContainer } from 'shared-components';
import QuickEntryEditor from './quick-entry-editor';
import TagSearch from './tag-search';

class EntryList extends Component {

    _navigateToEntry = (ev, entryData) => {
        ev.preventDefault();
        const { appActions } = this.props;

        appActions.showEntryModal(entryData).then(() => {});
    };
    selectTag = (tag) => {
        const { params } = this.props;
        this.context.router.push(`/${params.akashaId}/explore/tag/${tag}`);
    };
    _handleComment = (ev, entryAddress) => {
        const { appActions, entryState } = this.props;
        const entry = entryState.get('published').find(entry =>
          entry.get('address') === entryAddress);
        appActions.showEntryModal(entry, { section: 'comments' });
    };
    _handleEditorFullScreen = (ev, draft) => {
        const { entryActions, loggedProfileData } = this.props;
        entryActions.createDraft(loggedProfileData.get('akashaId'), draft);
    };

    subscribeTag = () => {
        const { selectedTag, tagActions } = this.props;
        tagActions.addSubscribeTagAction(selectedTag);
    };

    unsubscribeTag = () => {
        const { selectedTag, tagActions } = this.props;
        tagActions.addUnsubscribeTagAction(selectedTag);
    };

    render () {
        const { loggedProfileData, selectedTag, tagEntries, savedEntries, moreTagEntries,
            moreSavedEntries, tagEntriesCount, entriesStream, subscribePending, params,
            entryActions, fetchingTagEntries, fetchingMoreTagEntries, registerPending,
            fetchingSavedEntriesList, fetchingMoreSavedEntriesList, getTriggerRef, tagActions } = this.props;
        const { palette } = this.context.muiTheme;
        const entries = params.filter === 'tag' ? tagEntries : savedEntries;
        const moreEntries = params.filter === 'tag' ? moreTagEntries : moreSavedEntries;
        const subscriptions = parseInt(loggedProfileData.get('subscriptionsCount'), 10) > 0 ?
            entriesStream.get('tags') :
            null;
        const registerPendingFlag = registerPending && registerPending.find(tag =>
            tag.tagName === selectedTag);
        const subscribePendingFlag = subscribePending && subscribePending.find(subs =>
            subs.tagName === selectedTag);
        const fetchingEntries = params.filter === 'tag' ? fetchingTagEntries : fetchingSavedEntriesList;
        const fetchingMoreEntries = params.filter === 'tag' ?
            fetchingMoreTagEntries :
            fetchingMoreSavedEntriesList;
        return (
          <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
          >
            {params.filter === 'tag' && selectedTag &&
              <TagSearch
                tagName={selectedTag}
                tagEntriesCount={tagEntriesCount}
                subscriptions={subscriptions}
                subscribeTag={this.subscribeTag}
                unsubscribeTag={this.unsubscribeTag}
                registerPending={registerPendingFlag}
                subscribePending={subscribePendingFlag}
                selectTag={this.selectTag}
                publishTag={tagActions.addRegisterTagAction}
              />
            }
            {/* params.filter === 'bookmarks' &&
              <QuickEntryEditor
                loggedProfile={profileState.get('loggedProfile')}
                onFullScreenClick={this._handleEditorFullScreen}
              />
            */ }
            <EntryListContainer
              entries={entries}
              fetchingEntries={fetchingEntries}
              fetchingMoreEntries={fetchingMoreEntries}
              getTriggerRef={getTriggerRef}
              moreEntries={moreEntries}
            />
          </div>
        );
    }
}

EntryList.propTypes = {
    appActions: PropTypes.shape(),
    entriesStream: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    fetchingTagEntries: PropTypes.bool,
    fetchingMoreTagEntries: PropTypes.bool,
    fetchingSavedEntriesList: PropTypes.bool,
    fetchingMoreSavedEntriesList: PropTypes.bool,
    getTriggerRef: PropTypes.func,
    loggedProfileData: PropTypes.shape(),
    moreSavedEntries: PropTypes.bool,
    moreTagEntries: PropTypes.bool,
    params: PropTypes.shape(),
    registerPending: PropTypes.shape(),
    savedEntries: PropTypes.shape(),
    selectedTag: PropTypes.string,
    subscribePending: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    tagEntries: PropTypes.shape(),
    tagEntriesCount: PropTypes.shape(),
};
EntryList.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};
export default EntryList;
