import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { LogoIcon } from 'shared-components/svg';
import { SettingsActions } from 'local-flux';

const buttonStyle = {
    width: '48px',
    height: '48px',
    minWidth: 'initial',
    borderRadius: '50%',
    cursor: 'initial'
};

class LogoButton extends Component {
    onClick = () => {
        const { settingsActions, theme } = this.props;
        const newTheme = theme === 'light' ? 'dark' : 'light';

        settingsActions.saveSettings('general', { theme: newTheme });
        settingsActions.changeTheme(newTheme);
    };

    render () {
        const { logoStyle, viewBox, className } = this.props;
        return (<FlatButton
          className={className}
          icon={<LogoIcon logoStyle={logoStyle} viewBox={viewBox} />}
          hoverColor="transparent"
          onClick={this.onClick}
          style={buttonStyle}
        />);
    }
}

LogoButton.propTypes = {
    settingsActions: PropTypes.shape().isRequired,
    logoStyle: PropTypes.shape(),
    viewBox: PropTypes.string,
    className: PropTypes.string,
    theme: PropTypes.string
};

function mapStateToProps (state, ownProps) {
    return {
        theme: state.settingsState.get('general').get('theme')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        settingsActions: new SettingsActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoButton);
