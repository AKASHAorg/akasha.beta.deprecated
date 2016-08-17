import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import Auth from './components/Auth';
import { ProfileActions, BootstrapActions } from 'local-flux';

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
    promise: ({ store: { dispatch, getState } }) =>
        Promise.resolve(new BootstrapActions(dispatch).initAuth(getState))
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth));
