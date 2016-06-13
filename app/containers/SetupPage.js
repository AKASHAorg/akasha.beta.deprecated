import { connect } from 'react-redux';
import Setup from '../components/startup/Setup';
import { SetupActions } from '../actions/SetupActions';

function mapStateToProps (state) {
    return {
        setupConfig: state.setupConfig
    };
}

function mapDispatchToProps (dispatch) {
    return {
        setupActions: new SetupActions(dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setup);
