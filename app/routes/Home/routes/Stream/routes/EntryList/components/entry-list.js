import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { entryMessages } from 'locale-data/messages';
import { EntryListContainer } from 'shared-components';
import { List } from 'immutable';
import QuickEntryEditor from './quick-entry-editor';
import TagSearch from './tag-search';

class EntryList extends Component {

    selectTag = (tag) => {
        const { params } = this.props;
        this.context.router.push(`/${params.akashaId}/explore/tag/${tag}`);
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
        const { allStreamEntries, entriesStream, fetchingAllStream, fetchingMoreAllStream,
            fetchingMoreSavedEntriesList, fetchingMoreTagEntries, fetchingSavedEntriesList,
            fetchingTagEntries, getTriggerRef, intl, loggedProfileData, moreAllStreamEntries,
            moreSavedEntries, moreTagEntries, params, registerPending, savedEntries, selectedTag,
            subscribePending, tagActions, tagEntries, tagEntriesCount } = this.props;
        let entries = new List();
        let moreEntries;
        let fetchingEntries;
        let fetchingMoreEntries;
        let placeholderMessage;
        switch (params.filter) {
            case 'tag':
                entries = tagEntries;
                moreEntries = moreTagEntries;
                fetchingEntries = fetchingTagEntries;
                fetchingMoreEntries = fetchingMoreTagEntries;
                break;
            case 'bookmarks':
                entries = savedEntries;
                moreEntries = moreSavedEntries;
                fetchingEntries = fetchingSavedEntriesList;
                fetchingMoreEntries = fetchingMoreSavedEntriesList;
                break;
            case 'allEntries':
                entries = allStreamEntries;
                moreEntries = moreAllStreamEntries;
                fetchingEntries = fetchingAllStream;
                fetchingMoreEntries = fetchingMoreAllStream;
                placeholderMessage = intl.formatMessage(entryMessages.noNewEntries);
                break;
            default:
                break;
        }
        const subscriptions = parseInt(loggedProfileData.get('subscriptionsCount'), 10) > 0 ?
            entriesStream.get('tags') :
            null;
        const registerPendingFlag = registerPending && registerPending.find(tag =>
            tag.tagName === selectedTag);
        const subscribePendingFlag = subscribePending && subscribePending.find(subs =>
            subs.tagName === selectedTag);
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
              placeholderMessage={placeholderMessage}
            />
          </div>
        );
    }
}

EntryList.propTypes = {
    allStreamEntries: PropTypes.shape(),
    entriesStream: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    fetchingAllStream: PropTypes.bool,
    fetchingMoreAllStream: PropTypes.bool,
    fetchingMoreTagEntries: PropTypes.bool,
    fetchingMoreSavedEntriesList: PropTypes.bool,
    fetchingTagEntries: PropTypes.bool,
    fetchingSavedEntriesList: PropTypes.bool,
    getTriggerRef: PropTypes.func,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    moreAllStreamEntries: PropTypes.bool,
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
export default injectIntl(EntryList);
