import React, { Component, PropTypes } from 'react';
import { FlatButton } from 'material-ui';
import { DataLoader, EntryCard } from 'shared-components';
import QuickEntryEditor from './quick-entry-editor';
import TagSearch from './tag-search';

class EntryList extends Component {

    _navigateToEntry = (ev, entryData) => {
        ev.preventDefault();
        const { appActions } = this.props;

        appActions.showEntryModal(entryData).then(() => {
            console.log('start loading data');
        });
    };
    _navigateToTag = (ev, tag) => {
        const { loggedProfileData } = this.props;
        this.context.router.push(`/${loggedProfileData.get('akashaId')}/explore/tag/${tag}`);
    };
    _handleComment = (ev, entryAddress) => {
        const { appActions, entryState } = this.props;
        const entry = entryState.get('published').find(entry =>
          entry.get('address') === entryAddress);
        appActions.showEntryModal(entry, { section: 'comments' });
    };
    _handleShare = (ev, entry) => {
        console.log('share entry', entry);
    };
    _handleBookmark = (ev, entry) => {
        const { entryActions, loggedProfileData } = this.props;
        entryActions.createSavedEntry(loggedProfileData.get('akashaId'), entry);
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

    selectProfile = (address) => {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        router.push(`/${loggedAkashaId}/profile/${address}`);
    }

    selectTag = (tag) => {
        const { tagActions } = this.props;
        tagActions.saveTag(tag);
    }

    render () {
        const { loggedProfileData, selectedTag, tagEntries, savedEntries, moreTagEntries,
            moreSavedEntries, tagEntriesCount, entriesStream, subscribePending, params, blockNr,
            votePending, entryActions, savedEntriesIds, fetchingTagEntries, fetchingMoreTagEntries,
            fetchingSavedEntriesList, fetchingMoreSavedEntriesList } = this.props;
        const { palette } = this.context.muiTheme;
        const entries = params.filter === 'tag' ? tagEntries : savedEntries;
        const moreEntries = params.filter === 'tag' ? moreTagEntries : moreSavedEntries;

        const subscriptions = parseInt(loggedProfileData.get('subscriptionsCount'), 10) > 0 ?
            entriesStream.get('tags') :
            null;
        const subscribePendingFlag = subscribePending && subscribePending.find(subs =>
            subs.tagName === selectedTag);
        const timeout = 700;
        const flag = params.filter === 'tag' ? fetchingTagEntries : fetchingSavedEntriesList;
        const showMoreFlag = params.filter === 'tag' ?
            fetchingMoreTagEntries :
            fetchingMoreSavedEntriesList;
        return (
          <div style={{ paddingBottom: moreEntries && !showMoreFlag ? '30px' : '0px' }}>
            {params.filter === 'tag' && selectedTag &&
              <TagSearch
                tagName={selectedTag}
                tagEntriesCount={tagEntriesCount}
                subscriptions={subscriptions}
                subscribeTag={this.subscribeTag}
                unsubscribeTag={this.unsubscribeTag}
                subscribePending={subscribePendingFlag}
              />
            }
            {/* params.filter === 'bookmarks' &&
              <QuickEntryEditor
                loggedProfile={profileState.get('loggedProfile')}
                onFullScreenClick={this._handleEditorFullScreen}
              />
            */ }
            <DataLoader flag={flag} timeout={timeout} size={80} style={{ paddingTop: '120px' }}>
              <div>
                {entries.size === 0 &&
                  <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        color: palette.disabledColor,
                        paddingTop: '10px'
                    }}
                  >
                    No entries
                  </div>
                }
                {entries && entries.map((entry, key) => {
                    const voteEntryPending = votePending && votePending.find(vote =>
                        vote.entryId === entry.get('entryId'));
                    const isSaved = !!savedEntriesIds.find(id => id === entry.get('entryId'));
                    return <EntryCard
                      loggedAkashaId={loggedProfileData.get('akashaId')}
                      entry={entry}
                      key={key}
                      onContentClick={ev => this._navigateToEntry(ev, entry)}
                      onTagClick={this._navigateToTag}
                      handleComment={this.handleComment}
                      handleBookmark={this.handleBookmark}
                      blockNr={blockNr}
                      selectProfile={this.selectProfile}
                      selectTag={this.selectTag}
                      selectedTag={selectedTag}
                      voteEntryPending={voteEntryPending}
                      entryActions={entryActions}
                      isSaved={isSaved}
                    />;
                })}
                {moreEntries &&
                  <DataLoader flag={showMoreFlag} size={30}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <div ref={this.props.getTriggerRef} style={{ height: 0 }} />
                    </div>
                  </DataLoader>
                }
              </div>
            </DataLoader>
          </div>
        );
    }
}

EntryList.propTypes = {
    loggedProfileData: PropTypes.shape(),
    tagEntries: PropTypes.shape(),
    savedEntries: PropTypes.shape(),
    savedEntriesIds: PropTypes.shape(),
    moreTagEntries: PropTypes.bool,
    moreSavedEntries: PropTypes.bool,
    entriesStream: PropTypes.shape(),
    selectedTag: PropTypes.string,
    subscribePending: PropTypes.shape(),
    appActions: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    tagEntriesCount: PropTypes.shape(),
    blockNr: PropTypes.number,
    votePending: PropTypes.shape(),
    fetchingTagEntries: PropTypes.bool,
    fetchingMoreTagEntries: PropTypes.bool,
    fetchingSavedEntriesList: PropTypes.bool,
    fetchingMoreSavedEntriesList: PropTypes.bool,
    getTriggerRef: PropTypes.func,
    params: PropTypes.shape()
};
EntryList.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};
export default EntryList;
