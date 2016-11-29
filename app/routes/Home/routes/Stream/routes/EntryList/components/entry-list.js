import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { FlatButton } from 'material-ui';
import { EntryCard } from 'shared-components';
import QuickEntryEditor from './quick-entry-editor';
import TagSearch from './tag-search';
import { generalMessages } from 'locale-data/messages';

const LIMIT = 6;

class EntryList extends Component {
    constructor (props) {
        super(props);

        this.lastTagEntryIndex = 0;
        this.state = {};
    }

    componentWillReceiveProps (nextProps) {
        const { tagEntries, selectedTag } = nextProps;
        if (selectedTag !== this.props.selectedTag) {
            this.lastTagEntryIndex = 0;
            return;
        }
        if (tagEntries.size !== this.props.tagEntries.size) {
            this.lastTagEntryIndex = tagEntries.size > 0 ?
                tagEntries.last().get('entryId') :
                0;
        }
    }

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
    // handleUpvote = (payload) => {
    //     const { entryActions } = this.props;
    //     entryActions.addUpvoteAction(payload);
    // };
    // handleDownvote = (payload) => {
    //     const { entryActions } = this.props;
    //     entryActions.addDownvoteAction(payload);
    // };
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

    showMoreTagEntries = () => {
        const { entryActions, selectedTag } = this.props;
        entryActions.entryTagIterator(selectedTag, this.lastTagEntryIndex, LIMIT);
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
            votePending, entryActions, intl } = this.props;
        const entries = params.filter === 'tag' ? tagEntries : savedEntries;
        const moreEntries = params.filter === 'tag' ? moreTagEntries : moreSavedEntries;
        const showMoreEntries = params.filter === 'tag' ?
            this.showMoreTagEntries :
            this.showMoreSavedEntries;
        const subscriptions = parseInt(loggedProfileData.get('subscriptionsCount'), 10) > 0 ?
            entriesStream.get('tags') :
            null;
        const subscribePendingFlag = subscribePending && subscribePending.find(subs =>
            subs.tagName === selectedTag);
        return (
          <div>
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
            {entries && entries.map((entry, key) => {
                const voteEntryPending = votePending && votePending.find(vote =>
                    vote.entryId === entry.get('entryId'));
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
                />;
            })}
            {moreEntries &&
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <FlatButton
                  label={intl.formatMessage(generalMessages.showMore)}
                  onClick={showMoreEntries}
                  labelStyle={{ fontSize: '12px' }}
                  primary
                />
              </div>
            }
          </div>
        );
    }
}

EntryList.propTypes = {
    loggedProfileData: PropTypes.shape(),
    tagEntries: PropTypes.shape(),
    savedEntries: PropTypes.shape(),
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
    params: PropTypes.shape(),
    intl: PropTypes.shape()
};
EntryList.contextTypes = {
    router: PropTypes.shape()
};
export default injectIntl(EntryList);
