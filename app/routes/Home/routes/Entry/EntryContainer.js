import { connect } from 'react-redux';
import { AppActions, EntryActions } from 'local-flux';
import EntryPage from './components/entry-page';

function mapStateToProps (state, ownProps) {
    return {
        entry: state.entryState.get('entries')
            .find(entry => entry.get('entryId') === ownProps.routeParams.entryId),
        votePending: state.entryState.getIn(['flags', 'votePending']),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryPage);
