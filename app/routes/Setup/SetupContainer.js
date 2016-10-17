import { connect } from 'react-redux';
import {
    AppActions,
    SettingsActions,
    EProcActions, } from 'local-flux';
import Setup from './components/setup';

function mapStateToProps (state) {
    return {
        configFlags: state.settingsState.get('flags')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        eProcActions: new EProcActions(dispatch),
        settingsActions: new SettingsActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Setup);
