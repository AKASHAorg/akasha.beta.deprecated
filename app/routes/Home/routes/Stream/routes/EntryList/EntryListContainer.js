import { connect } from 'react-redux';
import { EntryActions, AppActions, TagActions } from 'local-flux';
import EntryList from './components/entry-list';

function mapStateToProps (state) {
    return {
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('akashaId') === state.profileState.getIn(['loggedProfile', 'akashaId'])),
        tagEntries: state.entryState.get('entries')
            .filter(entry => entry.get('type') === 'tagEntry')
            .map(entry => entry.get('content')),
        savedEntries: state.entryState.get('entries')
            .filter(entry => entry.get('type') === 'savedEntry'),
        moreTagEntries: state.entryState.get('moreTagEntries'),
        moreSavedEntries: state.entryState.get('moreSavedEntries'),
        entriesStream: state.entryState.get('entriesStream'),
        selectedTag: state.tagState.get('selectedTag'),
        subscribePending: state.tagState.getIn(['flags', 'subscribePending']),
        tagEntriesCount: state.entryState.get('tagEntriesCount'),
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        votePending: state.entryState.getIn(['flags', 'votePending'])
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
