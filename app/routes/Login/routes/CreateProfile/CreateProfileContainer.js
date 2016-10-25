import { connect } from 'react-redux';
import CreateProfile from './components/CreateProfile';
import { TempProfileActions, ValidationActions } from 'local-flux';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile'),
        gethStatus: state.externalProcState.get('gethStatus'),
        ipfsStatus: state.externalProcState.get('ipfsStatus')
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
