import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PanelLoader from '../components/panels/panel-loader';
import * as PanelActions from '../actions/PanelActions';

function mapStateToProps (state) {
    return {
        panelState: state.panelState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(PanelActions, dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PanelLoader);
