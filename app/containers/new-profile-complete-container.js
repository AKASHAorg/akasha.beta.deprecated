import { connect } from 'react-redux';
import NewProfileComplete from '../components';
import { tempProfileUpdate, tempProfileDelete } from '../local-flux/actions/temp-profile-actions';

function mapStateToProps (state) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile')
    };
}

export default connect(
    mapStateToProps,
    {
        tempProfileUpdate,
        tempProfileDelete,
    }
)(NewProfileComplete);
