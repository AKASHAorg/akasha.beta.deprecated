import { connect } from 'react-redux';
import { ProfileActions, SettingsActions, TempProfileActions, UtilsActions } from 'local-flux';
import Auth from './components/Auth';

function mapStateToProps (state, ownProps) {
    return {
        backupPending: state.utilsState.getIn(['flags', 'backupPending']),
        tempProfile: state.tempProfileState.get('tempProfile'),
        localProfiles: state.profileState.get('profiles'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginErrors: state.profileState.get('errors').filter(error => error.get('type') === 'login'),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        localProfilesFetched: state.profileState.get('flags').get('localProfilesFetched'),
        fetchingLocalProfiles: state.profileState.get('flags').get('fetchingLocalProfiles'),
        gethStatus: state.externalProcState.get('gethStatus'),
        ipfsStatus: state.externalProcState.get('ipfsStatus'),
        passwordPreference: state.settingsState.get('userSettings').passwordPreference
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
        tempProfileActions: new TempProfileActions(dispatch),
        utilsActions: new UtilsActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth);
