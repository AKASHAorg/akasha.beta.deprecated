import { connect } from 'react-redux';
import { ProfileActions, EntryActions, TagActions } from 'local-flux';
import PublishTags from './components/publish-tags';

function mapStateToProps (state) {
    return {
        profileState: state.profileState,
        entryState: state.entryState,
        tagState: state.tagState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishTags);

