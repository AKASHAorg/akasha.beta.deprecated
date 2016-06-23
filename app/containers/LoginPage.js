import { connect } from 'react-redux';
import Auth from '../components/auth/Auth';
import { ProfileActions } from '../actions';

function mapStateToProps (state) {
    return {
        profileState: state.profileState
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
