import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { profileClearLocal, profileDeleteLogged,
    profileGetLocal } from '../local-flux/actions/profile-actions';
import { backupKeysRequest } from '../local-flux/actions/utils-actions';
import { selectLocalProfiles, selectProfileFlag, selectGethStatus, selectIpfsStatus,
    getPasswordPreference, getBackupPendingFlag } from '../local-flux/selectors';
import { Auth } from '../components';

function mapStateToProps (state) {
    return {
        backupPending: getBackupPendingFlag(state),
        fetchingProfileList: selectProfileFlag(state, 'fetchingProfileList'),
        gethStatus: selectGethStatus(state),
        localProfiles: selectLocalProfiles(state),
        localProfilesFetched: selectProfileFlag(state, 'localProfilesFetched'),
        ipfsStatus: selectIpfsStatus(state),
        passwordPreference: getPasswordPreference(state),
        pendingListProfiles: selectProfileFlag(state, 'pendingListProfiles'),
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
