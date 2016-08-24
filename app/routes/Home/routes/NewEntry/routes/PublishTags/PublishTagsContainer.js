import PublishTags from './components/publish-tags';
import { BootstrapBundleActions } from 'local-flux';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { ProfileActions, EntryActions, TagActions } from 'local-flux';

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

export default asyncConnect([{
    promise: ({ store: { dispatch, getState }, params }) => {
        const bootstrapActions = new BootstrapBundleActions(dispatch);
        // Promise.resolve(bootstrapActions.initHome(getState));
    }
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishTags));

