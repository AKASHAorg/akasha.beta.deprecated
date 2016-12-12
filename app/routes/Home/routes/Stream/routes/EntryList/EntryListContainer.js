import { connect } from 'react-redux';
import { EntryActions, AppActions, TagActions } from 'local-flux';
import EntryList from './components/entry-list';

function mapStateToProps (state) {
    const savedEntries = state.entryState.get('entries')
            .filter(entry => entry.get('type') === 'savedEntry');
    return {
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        tagEntries: state.entryState.get('entries')
            .filter(entry => entry.get('type') === 'tagEntry')
            .map(entry => entry.get('content')),
        savedEntries,
        savedEntriesIds: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        moreTagEntries: state.entryState.get('moreTagEntries'),
        moreSavedEntries: state.entryState.get('savedEntries').size > savedEntries.size &&
            !state.entryState.getIn(['flags', 'fetchingSavedEntriesList']),
        entriesStream: state.entryState.get('entriesStream'),
        selectedTag: state.tagState.get('selectedTag'),
        subscribePending: state.tagState.getIn(['flags', 'subscribePending']),
        tagEntriesCount: state.entryState.get('tagEntriesCount'),
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        votePending: state.entryState.getIn(['flags', 'votePending']),
        fetchingTagEntries: state.entryState.getIn(['flags', 'fetchingTagEntries']),
        fetchingMoreTagEntries: state.entryState.getIn(['flags', 'fetchingMoreTagEntries']),
        fetchingSavedEntriesList: state.entryState.getIn(['flags', 'fetchingSavedEntriesList']),
        fetchingMoreSavedEntriesList: state.entryState.getIn(['flags', 'fetchingMoreSavedEntriesList']),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryList);
