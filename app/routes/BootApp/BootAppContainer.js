import BootApp from './components/boot-app';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { AppActions, BootstrapBundleActions, EProcActions } from 'local-flux';

function mapStateToProps(state) {
    return {
        appState: state.appState,
        externalProcState: state.externalProcState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        eProcActions: new EProcActions(dispatch),
    };
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) => {
        const bootstrapActions = new BootstrapBundleActions(dispatch);
        return Promise.resolve(bootstrapActions.bootApp(getState));
    }
        
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(BootApp));
