import { connect } from 'react-redux';
import { SettingsActions } from 'local-flux';
import Setup from './components/setup';

function mapStateToProps (state, ownProps) {
    return {
        generalSettingsPending: state.settingsState.get('generalSettingsPending'),
        theme: state.settingsState.getIn(['general', 'theme'])
    };
}

function mapDispatchToProps (dispatch) {
    return {
        settingsActions: new SettingsActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Setup);
