import { connect } from 'react-redux';
import { tempProfileUpdate } from '../local-flux/actions/temp-profile-actions';
import { NewProfileStatus } from '../components';


function mapStateToProps (state) {
    return {
        akashaId: state.tempProfileState.getIn(['tempProfile', 'akashaId']),
        tempProfileStatus: state.tempProfileState.get('status'),
    };
}

export default connect(
    mapStateToProps,
    {
        tempProfileUpdate
    }
)(NewProfileStatus);

