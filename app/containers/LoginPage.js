import { connect } from 'react-redux';
import Auth from '../components/auth/Auth';
import { ProfileActions } from '../actions/ProfileActions';

function mapStateToProps (state) {
    return {
        authState: state.authState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Auth);
