import React from 'react';
import TagSearch from './tag-search';
import QuickEntryEditor from './quick-entry-editor';
import { EntryCard } from 'shared-components';

class EntryList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    _navigateToEntry = (ev, entryData) => {
        ev.preventDefault();
        const { appActions } = this.props;

        appActions.showEntryModal(entryData).then(() => {
            console.log('start loading data');
        });
    };
    _navigateToTag = (ev, tag) => {
        const { profileState } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        this.context.router.push(`/${loggedProfile.get('userName')}/explore/tag/${tag}`);
    };
    _handleUpvote = (ev, entryAddress) => {
        const { appActions } = this.props;
        appActions.getConfirmation('upvote', entryAddress);
    };
    _handleDownvote = (ev, entryAddress) => {
        const { appActions } = this.props;
        appActions.getConfirmation('downvote', entryAddress);
    };
    _handleComment = (ev, entryAddress) => {
        const { appActions, entryState } = this.props;
        const entry = entryState.get('published').find(entry =>
          entry.get('address') === entryAddress);
        appActions.showEntryModal(entry, { section: 'comments' });
    };
    _handleShare = (ev, entryAddress) => {};
    _handleBookmark = (ev, entryAddress) => {};
    render () {
        const { params, profileState, entryState } = this.props;
        const entries = entryState.get('published');
        return (
          <div>
            {params.filter === 'tag' && params.tagName &&
              <TagSearch tagName={params.tagName} />
            }
            {params.filter === 'stream' &&
              <QuickEntryEditor loggedProfile={profileState.get('loggedProfile')} />
            }
            {entries && entries.map((entry, key) =>
              <EntryCard
                entry={entry}
                key={key}
                onContentClick={(ev) => this._navigateToEntry(ev, entry)}
                onTagClick={this._navigateToTag}
                onUpvote={this._handleUpvote}
                onDownvote={this._handleDownvote}
                onComment={this._handleComment}
                onShare={this._handleShare}
                onBookmark={this._handleBookmark}
              />
            )}
          </div>
        );
    }
}

EntryList.propTypes = {
    params: React.PropTypes.object,
    profileState: React.PropTypes.object,
    appActions: React.PropTypes.object,
    entryState: React.PropTypes.object
};
EntryList.contextTypes = {
    router: React.PropTypes.object
};
export default EntryList;
