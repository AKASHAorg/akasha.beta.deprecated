import { connect } from 'react-redux';
import CreateProfileComplete from './components/CreateProfileComplete';
import { ProfileActions, TempProfileActions } from 'local-flux';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        tempProfileActions: new TempProfileActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProfileComplete);
