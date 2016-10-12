import React, { PropTypes } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { setupMessages } from 'locale-data/messages';

const errorStyle = { color: Colors.minBlack, overflowX: 'visible', whiteSpace: 'nowrap' };
const floatingLabelStyle = { color: Colors.lightBlack };
const inputStyle = { color: Colors.darkBlack };
const selectStyle = { maxWidth: '120px' };

const GethSettingsForm = ({ intl, gethSettings, handleGethDatadir, handleGethCacheSize }) =>
    <div>
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

GethSettingsForm.propTypes = {
    intl: PropTypes.shape(),
    gethSettings: PropTypes.shape(),
    handleGethDatadir: PropTypes.func,
    handleGethCacheSize: PropTypes.func
};

export default GethSettingsForm;
