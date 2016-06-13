import { connect } from 'react-redux';
import PanelLoader from '../components/panels/panel-loader';
import { PanelActions } from '../actions/PanelActions';

function mapStateToProps (state) {
    return {
        panelState: state.panelState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        panelActions: new PanelActions(dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelLoader);
