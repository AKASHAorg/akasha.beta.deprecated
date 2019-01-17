import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { profileClearLocal, profileDeleteLogged,
    profileGetLocal } from '../local-flux/actions/profile-actions';
import { backupKeysRequest } from '../local-flux/actions/utils-actions';
import { externalProcessSelectors, profileSelectors, utilsSelectors,
    settingsSelectors } from '../local-flux/selectors';
import { Auth } from '../components';

function mapStateToProps (state) {
    return {
        backupPending: utilsSelectors.getBackupPendingFlag(state),
        fetchingProfileList: profileSelectors.selectProfileFlag(state, 'fetchingProfileList'),
        gethStatus: externalProcessSelectors.selectGethStatus(state),
        localProfiles: profileSelectors.selectLocalProfiles(state),
        localProfilesFetched: profileSelectors.selectProfileFlag(state, 'localProfilesFetched'),
        ipfsStatus: externalProcessSelectors.selectIpfsStatus(state),
        passwordPreference: settingsSelectors.getPasswordPreference(state),
        pendingListProfiles: profileSelectors.selectProfileFlag(state, 'pendingListProfiles'),
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
