import React, { PropTypes } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';
import { setupMessages } from 'locale-data/messages';

const GethSettingsForm = ({ intl, gethSettings, handleGethDatadir, handleGethCacheSize }, { muiTheme }) => {
    const errorStyle = {
        color: muiTheme.palette.disabledColor,
        overflowX: 'visible',
        whiteSpace: 'nowrap'
    };
    const floatingLabelStyle = { color: muiTheme.palette.disabledColor, zIndex: 0 };
    const inputStyle = { color: muiTheme.palette.textColor };
    const selectStyle = { maxWidth: '120px' };

    return <div>
      <SelectField
        errorStyle={errorStyle}
        errorText={intl.formatMessage(setupMessages.changeGethCacheSize)}
        floatingLabelStyle={floatingLabelStyle}
        floatingLabelText={intl.formatMessage(setupMessages.gethCacheSize)}
        value={gethSettings.get('cache') || 512}
        onChange={handleGethCacheSize}
        style={selectStyle}
      >
        <MenuItem key={1} value={512} primaryText="512 MB" />
        <MenuItem key={2} value={1024} primaryText="1024 MB" />
        <MenuItem key={3} value={1536} primaryText="1536 MB" />
        <MenuItem key={4} value={2048} primaryText="2048 MB" />
      </SelectField>
      <TextField
        errorStyle={errorStyle}
        errorText={intl.formatMessage(setupMessages.changeGethDataDir)}
        floatingLabelStyle={floatingLabelStyle}
        floatingLabelText={intl.formatMessage(setupMessages.gethDataDirPath)}
        value={gethSettings.get('datadir') || ''}
        inputStyle={inputStyle}
        onClick={handleGethDatadir}
        onFocus={handleGethDatadir}
        fullWidth
      />
    </div>;
};

GethSettingsForm.propTypes = {
    intl: PropTypes.shape(),
    gethSettings: PropTypes.shape(),
    handleGethDatadir: PropTypes.func,
    handleGethCacheSize: PropTypes.func
};

GethSettingsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
}

export default GethSettingsForm;
