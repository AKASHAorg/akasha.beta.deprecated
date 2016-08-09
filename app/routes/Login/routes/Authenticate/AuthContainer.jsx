import { connect } from 'react-redux';
import Auth from './components/Auth';
import { ProfileActions } from 'local-flux';

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
