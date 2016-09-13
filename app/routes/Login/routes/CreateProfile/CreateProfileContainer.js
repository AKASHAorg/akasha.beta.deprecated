import { connect } from 'react-redux';
import CreateProfile from './components/CreateProfile';
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProfile);
