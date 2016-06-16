import { connect } from 'react-redux';
import PanelLoader from '../components/panels/panel-loader';
import { AppActions } from '../actions';

function mapStateToProps (state) {
    return {
        panelState: state.panelState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelLoader);
