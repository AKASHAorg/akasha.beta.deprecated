import { connect } from 'react-redux';
import { tempProfileUpdate, tempProfileCreate } from '../local-flux/actions/temp-profile-actions';
import { NewProfileForm } from '../components';

function mapStateToProps (state) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile')
    };
}

export default connect(
    mapStateToProps,
    {
        tempProfileCreate,
        tempProfileUpdate
    }
)(NewProfileForm);

export { NewProfileForm };
