import { connect } from 'react-redux';
import { ProfileActions } from 'local-flux';
import Auth from './components/Auth';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.profileState.get('tempProfile'),
        localProfiles: state.profileState.get('profiles'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginErrors: state.profileState.get('errors'),
        profilesFetched: state.profileState.get('profilesFetched')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth);
