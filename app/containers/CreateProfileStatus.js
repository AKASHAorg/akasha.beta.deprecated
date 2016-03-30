
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import CreateProfileStatus from '../components/startup/CreateProfileStatus';
import * as ProfileActions from '../actions/ProfileActions';

function mapStateToProps (state) {
  return {
    profile: state.profile
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
)(CreateProfileStatus);
