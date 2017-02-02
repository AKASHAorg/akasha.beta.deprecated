import { connect } from 'react-redux';
import { EntryActions, AppActions, TagActions } from 'local-flux';
import EntryList from './components/entry-list';

function mapStateToProps (state) {
    const savedEntries = state.entryState.get('entries')
        .filter(entry => entry.get('type') === 'savedEntry')
        .map(entry => entry.get('content'));
    return {
        allStreamEntries: state.entryState.get('entries')
            .filter(entry => entry.get('type') === 'allStreamEntry')
            .map(entry => entry.get('content')),
        entriesStream: state.entryState.get('entriesStream'),
        fetchingAllStream: state.entryState.getIn(['flags', 'fetchingAllStream']),
        fetchingMoreAllStream: state.entryState.getIn(['flags', 'fetchingMoreAllStream']),
        fetchingTagEntries: state.entryState.getIn(['flags', 'fetchingTagEntries']),
        fetchingMoreTagEntries: state.entryState.getIn(['flags', 'fetchingMoreTagEntries']),
        fetchingSavedEntriesList: state.entryState.getIn(['flags', 'fetchingSavedEntriesList']),
        fetchingMoreSavedEntriesList: state.entryState.getIn(['flags', 'fetchingMoreSavedEntriesList']),
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        moreAllStreamEntries: state.entryState.get('moreAllStreamEntries'),
        moreSavedEntries: state.entryState.get('savedEntries').size > savedEntries.size &&
            !state.entryState.getIn(['flags', 'fetchingSavedEntriesList']),
        moreTagEntries: state.entryState.get('moreTagEntries'),
        registerPending: state.tagState.getIn(['flags', 'registerPending']),
        savedEntries,
        selectedTag: state.tagState.get('selectedTag'),
        subscribePending: state.tagState.getIn(['flags', 'subscribePending']),
        tagEntries: state.entryState.get('entries')
            .filter(entry => entry.get('type') === 'tagEntry')
            .map(entry => entry.get('content')),
        tagEntriesCount: state.entryState.get('tagEntriesCount'),
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
