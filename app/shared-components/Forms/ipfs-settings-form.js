import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';
import { setupMessages } from 'locale-data/messages';

const IpfsSettingsForm = ({ intl, ipfsSettings, handleIpfsPath }, { muiTheme }) => {
    const errorStyle = { color: muiTheme.palette.disabledColor };
    const floatingLabelStyle = { color: muiTheme.palette.disabledColor, zIndex: 0 };
    const inputStyle = { color: muiTheme.palette.textColor };

    return <div>
      <TextField
        errorStyle={errorStyle}
        errorText={intl.formatMessage(setupMessages.changeIpfsStoragePath)}
        floatingLabelStyle={floatingLabelStyle}
        floatingLabelText={'IPFS Path'}
        value={ipfsSettings.get('storagePath') || ''}
        inputStyle={inputStyle}
        onClick={handleIpfsPath}
        onFocus={handleIpfsPath}
        type="text"
        fullWidth
      />
    </div>;
}

IpfsSettingsForm.propTypes = {
    intl: PropTypes.shape().isRequired,
    ipfsSettings: PropTypes.shape().isRequired,
    handleIpfsPath: PropTypes.func.isRequired
};

IpfsSettingsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
}

export default IpfsSettingsForm;
