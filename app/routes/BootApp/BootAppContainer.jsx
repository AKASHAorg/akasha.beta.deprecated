import BootApp from './components/boot-app';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { AppActions, BootstrapActions, EProcActions } from 'local-flux';

function mapStateToProps(state) {
    return {
        appState: state.appState,
        externalProcState: state.externalProcState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        bootstrapActions: new BootstrapActions(dispatch),
        eProcActions: new EProcActions(dispatch),
    };
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) =>
        Promise.resolve(new BootstrapActions(dispatch).bootApp(getState))
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(BootApp));
