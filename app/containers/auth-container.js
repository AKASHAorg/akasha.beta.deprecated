import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { profileClearLocal, profileDeleteLogged,
    profileGetLocal } from '../local-flux/actions/profile-actions';
import { backupKeysRequest } from '../local-flux/actions/utils-actions';
import { selectLocalProfiles, selectProfileFlag } from '../local-flux/selectors';
import { Auth } from '../components';

function mapStateToProps (state) {
    return {
        backupPending: state.utilsState.getIn(['flags', 'backupPending']),
        fetchingProfileList: selectProfileFlag(state, 'fetchingProfileList'),
        gethStatus: state.externalProcState.getIn(['geth', 'status']),
        localProfiles: selectLocalProfiles(state),
        localProfilesFetched: selectProfileFlag(state, 'localProfilesFetched'),
        ipfsStatus: state.externalProcState.getIn(['ipfs', 'status']),
        passwordPreference: state.settingsState.getIn(['userSettings', 'passwordPreference']),
        pendingListProfiles: state.profileState.getIn(['flags', 'pendingListProfiles']),
    };
}

export default connect(
    mapStateToProps,
    {
        backupKeysRequest,
        profileClearLocal,
        profileDeleteLogged,
        profileGetLocal,
    }
)(injectIntl(Auth));
