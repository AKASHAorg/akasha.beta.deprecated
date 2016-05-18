import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Auth from '../components/auth/Auth';
import * as AuthActions from '../actions/AuthActions';

function mapStateToProps (state) {
    return {
        authState: state.authState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(AuthActions, dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
