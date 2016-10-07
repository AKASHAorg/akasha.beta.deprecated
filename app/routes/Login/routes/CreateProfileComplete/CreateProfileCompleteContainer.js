import { connect } from 'react-redux';
import CreateProfileComplete from './components/CreateProfileComplete';
import { ProfileActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        tempProfile: state.profileState.get('tempProfile')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProfileComplete);
