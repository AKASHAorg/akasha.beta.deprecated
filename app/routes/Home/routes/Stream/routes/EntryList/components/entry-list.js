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
    }
    render () {
        const { params, profileState, entryState } = this.props;
        const filter = params.filter;
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
              />
            )}
          </div>
        );
    }
}

EntryList.propTypes = {
    params: React.PropTypes.object
};
EntryList.contextTypes = {
    router: React.PropTypes.object
}
export default EntryList;
