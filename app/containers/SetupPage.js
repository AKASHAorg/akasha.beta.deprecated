import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Setup from '../components/startup/Setup';
import * as SetupActions from '../actions/SetupActions';

function mapStateToProps (state) {
    return {
        setupConfig: state.setupConfig
    };
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(SetupActions, dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setup);
