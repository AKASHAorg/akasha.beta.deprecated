import { connect } from 'react-redux';
import { ProfileActions } from 'local-flux';
import Auth from './components/Auth';

function mapStateToProps (state) {
    return {
        tempProfile: state.profileState.get('tempProfile'),
        loggedProfile: state.profileState.get('loggedProfile'),
        localProfiles: state.profileState.get('profiles')
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
