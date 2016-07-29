import { connect } from 'react-redux';
import CreateProfile from '../shared-components/startup/CreateProfile';
import CreateProfileStatus from '../shared-components/startup/CreateProfileStatus';
import CreateProfileComplete from '../shared-components/startup/CreateProfileComplete';
import { ProfileActions, ValidationActions } from 'local-flux';

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
