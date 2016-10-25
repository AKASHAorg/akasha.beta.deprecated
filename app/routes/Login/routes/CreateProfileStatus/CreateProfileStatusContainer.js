import { connect } from 'react-redux';
import CreateProfileStatus from './components/CreateProfileStatus';
import { ProfileActions, TransactionActions, TempProfileActions } from 'local-flux';

function mapStateToProps (state, ownProps) {
    return {
        tempProfile: state.tempProfileState.get('tempProfile'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginRequested: state.profileState.get('loginRequested'),
        profileErrors: state.profileState.get('errors'),
        tempProfileErrors: state.tempProfileState.get('errors'),
        minedTransactions: state.transactionState.get('mined'),
        pendingTransactions: state.transactionState.get('pending'),
        gethStatus: state.externalProcState.get('gethStatus'),
        ipfsStatus: state.externalProcState.get('ipfsStatus')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        tempProfileActions: new TempProfileActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProfileStatus);
