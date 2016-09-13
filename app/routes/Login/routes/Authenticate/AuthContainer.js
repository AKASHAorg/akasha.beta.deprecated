import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Auth from './components/Auth';
import { ProfileActions, BootstrapBundleActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        profileState: state.profileState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch)
    };
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) => {
        const bootstrapActions = new BootstrapBundleActions(dispatch);
        return Promise.resolve(bootstrapActions.initAuth(getState));
    }
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth));
