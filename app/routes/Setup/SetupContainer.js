import { connect } from 'react-redux';
import {
    SettingsActions,
    EProcActions, } from 'local-flux';
import Setup from './components/setup';

function mapStateToProps (state) {
    return {
        settingsState: state.settingsState,
        configFlags: state.settingsState.get('flags')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        settingsActions: new SettingsActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Setup);
