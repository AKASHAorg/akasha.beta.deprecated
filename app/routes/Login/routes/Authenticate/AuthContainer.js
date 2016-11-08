import { connect } from 'react-redux';
import { ProfileActions, TempProfileActions } from 'local-flux';
import Auth from './components/Auth';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile'),
        localProfiles: state.profileState.get('profiles'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginErrors: state.profileState.get('errors'),
        localProfilesFetched: state.profileState.get('flags').get('localProfilesFetched'),
        fetchingLocalProfiles: state.profileState.get('flags').get('fetchingLocalProfiles'),
        gethStatus: state.externalProcState.get('gethStatus'),
        ipfsStatus: state.externalProcState.get('ipfsStatus')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        tempProfileActions: new TempProfileActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth);
