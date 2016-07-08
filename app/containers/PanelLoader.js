import { connect } from 'react-redux';
import PanelLoader from '../components/panels/panel-loader';
import { AppActions, ProfileActions } from '../actions';

function mapStateToProps (state) {
    return {
        panelState: state.panelState,
        profileState: state.profileState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelLoader);
