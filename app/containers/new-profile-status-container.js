import { connect } from 'react-redux';
import { showReportModal } from '../local-flux/actions/app-actions';
import { tempProfileUpdate, tempProfileGetRequest,
    tempProfileCreate, tempProfileDelete, tempProfileStatusReset } from '../local-flux/actions/temp-profile-actions';
import { NewProfileStatus } from '../components';

function mapStateToProps (state) {
    return {
        akashaId: state.tempProfileState.getIn(['tempProfile', 'akashaId']),
        tempProfile: state.tempProfileState.get('tempProfile'),
        tempProfileStatus: state.tempProfileState.get('status'),
        errorsById: state.errorState.get('byId'),
    };
}

export default connect(
    mapStateToProps,
    {
        tempProfileCreate,
        tempProfileDelete,
        tempProfileUpdate,
        tempProfileGetRequest,
        tempProfileStatusReset,
        showReportModal,
    }
)(NewProfileStatus);
