import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateProfile from '../components/startup/CreateProfile';
import CreateProfileStatus from '../components/startup/CreateProfileStatus';
import CreateProfileComplete from '../components/startup/CreateProfileComplete';
import * as ProfileActions from '../actions/ProfileActions';

function mapStateToProps (state) {
    return {
        profile: state.profile
    };
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(ProfileActions, dispatch)
    };
}

export default {
    CreateProfile: connect(mapStateToProps, mapDispatchToProps)(CreateProfile),
    CreateProfileStatus: connect(mapStateToProps, mapDispatchToProps)(CreateProfileStatus),
    CreateProfileComplete: connect(mapStateToProps, mapDispatchToProps)(CreateProfileComplete)
};
