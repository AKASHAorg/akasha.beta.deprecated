import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';
import { setupMessages } from '../../locale-data/messages';
import { GethCacheSelectField, PathInputField } from '../';

const floatingLabelStyle = {
    cursor: 'default',
    overflowX: 'visible',
    whiteSpace: 'nowrap'
};

export default function GethOptionsForm (props, { muiTheme }) {
    const { cache, intl, gethSettings, style, onCacheChange, showSuccessMessage } = props;
    const { palette } = muiTheme;
    const inputStyle = { color: palette.textColor };
    const labelStyle = Object.assign({}, floatingLabelStyle, { color: palette.disabledColor });

    return (
      <div style={style}>
        <GethCacheSelectField
          cache={cache}
          intl={intl}
          onChange={onCacheChange}
        />
        <PathInputField
          disabled
          floatingLabelText={intl.formatMessage(setupMessages.gethDataDirPath)}
          path={gethSettings.get('datadir')}
        />
        <PathInputField
          disabled
          floatingLabelText={intl.formatMessage(setupMessages.gethIPCPath)}
          path={gethSettings.get('ipcpath')}
        />
        <TextField
          floatingLabelStyle={labelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.gethNetworkId)}
          floatingLabelFixed
          value={gethSettings.get('networkid') || ''}
          inputStyle={inputStyle}
          style={{ width: '120px' }}
          type="number"
          disabled
        />
        {showSuccessMessage &&
          <div style={{ color: palette.accent3Color, marginTop: '15px' }}>
            {intl.formatMessage(setupMessages.saveGethSettingsSuccess)}
          </div>
        }
      </div>
    );
}

GethOptionsForm.propTypes = {
    intl: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    onCacheChange: PropTypes.func.isRequired,
    cache: PropTypes.number,
    showSuccessMessage: PropTypes.bool
};

GethOptionsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};
