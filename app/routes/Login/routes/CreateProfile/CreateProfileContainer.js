import { connect } from 'react-redux';
import CreateProfile from './components/CreateProfile';
import { TempProfileActions, ValidationActions } from 'local-flux';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        tempProfileActions: new TempProfileActions(dispatch),
        validationActions: new ValidationActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProfile);
