import { connect } from 'react-redux';
import CreateProfileStatus from './components/CreateProfileStatus';
import { ProfileActions, TransactionActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        tempProfile: state.profileState.get('tempProfile'),
        loggedProfile: state.profileState.get('loggedProfile'),
        errors: state.profileState.get('errors'),
        minedTransactions: state.transactionState.get('mined'),
        pendingTransactions: state.transactionState.get('pending'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CreateProfileStatus);
