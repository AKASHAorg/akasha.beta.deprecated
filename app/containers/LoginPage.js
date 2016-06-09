import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Auth from '../components/auth/Auth';
import * as ProfileActions from '../actions/ProfileActions';

function mapStateToProps (state) {
    return {
        authState: state.authState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(ProfileActions, dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
