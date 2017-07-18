import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FlatButton } from 'material-ui';
import { LogoIcon } from './svg';
import { saveGeneralSettings } from '../local-flux/actions/settings-actions';

const buttonStyle = {
    width: '48px',
    height: '48px',
    minWidth: 'initial',
    borderRadius: '50%',
    cursor: 'initial'
};

const LogoButton = (props) => {
    const { className, logoStyle, saveGenSettings, theme, viewBox } = props;
    const onClick = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        saveGenSettings({ theme: newTheme });
    };

    return (
      <FlatButton
        className={className}
        icon={<LogoIcon logoStyle={logoStyle} viewBox={viewBox} />}
        hoverColor="transparent"
        onClick={onClick}
        style={buttonStyle}
      />
    );
};

LogoButton.propTypes = {
    logoStyle: PropTypes.shape(),
    viewBox: PropTypes.string,
    className: PropTypes.string,
    saveGenSettings: PropTypes.func.isRequired,
    theme: PropTypes.string.isRequired
};

function mapStateToProps (state) {
    return {
        theme: state.settingsState.get('general').get('theme')
    };
}

export { LogoButton };
export default connect(mapStateToProps, { saveGenSettings: saveGeneralSettings })(LogoButton);
