import { connect } from 'react-redux';
import { ProfileActions, EntryActions, AppActions, TagActions } from 'local-flux';
import EntryList from './components/entry-list';

function mapStateToProps (state) {
    return {
        loggedProfileData: state.profileState.get('profiles').find(prf =>
            prf.get('akashaId') === state.profileState.getIn(['loggedProfile', 'akashaId'])),
        tagEntries: state.entryState.get('tagEntries').map(entry => entry.get('content')),
        savedEntries: state.entryState.get('savedEntries'),
        moreTagEntries: state.entryState.get('moreTagEntries'),
        moreSavedEntries: state.entryState.get('moreSavedEntries'),
        entriesStream: state.entryState.get('entriesStream'),
        selectedTag: state.tagState.get('selectedTag'),
        subscribePending: state.tagState.getIn(['flags', 'subscribePending']),
        tagEntriesCount: state.entryState.get('tagEntriesCount')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryList);
