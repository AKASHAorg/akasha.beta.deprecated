import { connect } from 'react-redux';
import { showLoginDialog } from 'local-flux/actions/app-actions';
import { profileClearLocal, profileGetLocal } from 'local-flux/actions/profile-actions';
import { tempProfileRequest } from 'local-flux/actions/temp-profile-actions';
import { backupKeysRequest } from 'local-flux/actions/utils-actions';
import { selectLocalProfiles, selectProfileFlag } from 'local-flux/selectors';
import Auth from './components/Auth';

function mapStateToProps (state) {
    return {
        backupPending: state.utilsState.getIn(['flags', 'backupPending']),
        fetchingProfileList: selectProfileFlag(state, 'fetchingProfileList'),
        gethStatus: state.externalProcState.getIn(['geth', 'status']),
        ipfsStatus: state.externalProcState.getIn(['ipfs', 'status']),
        localProfiles: selectLocalProfiles(state),
        localProfilesFetched: selectProfileFlag(state, 'localProfilesFetched'),
        loginErrors: state.profileState.get('errors').filter(error => error.get('type') === 'login'),
        tempProfile: state.tempProfileState.get('tempProfile'),
    };
}

export default connect(
    mapStateToProps,
    {
        backupKeysRequest,
        profileClearLocal,
        profileGetLocal,
        showLoginDialog,
        tempProfileRequest,
    }
)(Auth);
