import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { setupMessages } from 'locale-data/messages';

const errorStyle = { color: Colors.minBlack };
const floatingLabelStyle = { color: Colors.lightBlack };
const inputStyle = { color: Colors.darkBlack };

const IpfsSettingsForm = ({ intl, ipfsSettings, handleIpfsPath }) =>
  <div>
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

IpfsSettingsForm.propTypes = {
    intl: PropTypes.shape().isRequired,
    ipfsSettings: PropTypes.shape().isRequired,
    handleIpfsPath: PropTypes.func.isRequired
};

export default IpfsSettingsForm;
