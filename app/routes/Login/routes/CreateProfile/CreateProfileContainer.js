import { connect } from 'react-redux';
import CreateProfile from './components/CreateProfile';
import { AppActions, TempProfileActions, ValidationActions } from 'local-flux';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile'),
        gethStatus: state.externalProcState.get('gethStatus'),
        ipfsStatus: state.externalProcState.get('ipfsStatus')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        tempProfileActions: new TempProfileActions(dispatch),
        validationActions: new ValidationActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProfile);
