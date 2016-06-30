import { connect } from 'react-redux';
import CreateProfile from '../components/startup/CreateProfile';
import CreateProfileStatus from '../components/startup/CreateProfileStatus';
import CreateProfileComplete from '../components/startup/CreateProfileComplete';
import { ProfileActions, ValidationActions } from '../actions';

function mapStateToProps (state) {
    return {
        profileState: state.profileState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        validationActions: new ValidationActions(dispatch)
    };
}

export default {
    CreateProfile: connect(mapStateToProps, mapDispatchToProps)(CreateProfile),
    CreateProfileStatus: connect(mapStateToProps, mapDispatchToProps)(CreateProfileStatus),
    CreateProfileComplete: connect(mapStateToProps, mapDispatchToProps)(CreateProfileComplete)
};
