import { connect } from 'react-redux';
import { AppActions, EProcActions } from 'local-flux';
import BootApp from './components/boot-app';

function mapStateToProps (state) {
    return {
        appState: state.appState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        eProcActions: new EProcActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(BootApp);
