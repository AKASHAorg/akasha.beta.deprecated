import React from 'react';
import TagSearch from './tag-search';
import QuickEntryEditor from './quick-entry-editor';
import { EntryCard } from 'shared-components';
import { injectIntl } from 'react-intl'
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
    _handleUpvote = (ev, entry) => {
        const { appActions } = this.props;
        const authorFirstName = entry.getIn(['author', 'firstName']);
        const authorLastName = entry.getIn(['author', 'lastName']);
        const intl = this.props.intl;
        appActions.getConfirmation({
            action: 'upvote',
            address: entry.get('address'),
            title: entry.get('title'),
            subtitle: `${intl.formatMessage({
                id: 'app.general.by',
                defaultMessage: 'by',
                description: 'entry is published `by` someone'
            })} ${authorFirstName} ${authorLastName}`,
            authorName: `${authorFirstName} ${authorLastName}`,
            disclaimer: 'disclaimer'
        });
    };
    _handleDownvote = (ev, entry) => {
        const { appActions } = this.props;
        appActions.getConfirmation('downvote', entry);
    };
    _handleComment = (ev, entryAddress) => {
        const { appActions, entryState } = this.props;
        const entry = entryState.get('published').find(entry =>
          entry.get('address') === entryAddress);
        appActions.showEntryModal(entry, { section: 'comments' });
    };
    _handleShare = (ev, entry) => {};
    _handleBookmark = (ev, entry) => {
        const { entryActions, profileState } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        entryActions.createSavedEntry(loggedProfile.get('userName'), entry);
    };
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
    entryState: React.PropTypes.object,
    intl: React.PropTypes.object
};
EntryList.contextTypes = {
    router: React.PropTypes.object
};
export default injectIntl(EntryList);
