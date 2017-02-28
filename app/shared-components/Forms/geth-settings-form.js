import React, { PropTypes, Component } from 'react';
import { TextField, SelectField, MenuItem } from 'material-ui';
import { setupMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions

class GethSettingsForm extends Component {
    _handleDialogOpen = () => {
        this.gethDirPath.click();
    };

    _handleGethPath = () => {
        const files = this.gethDirPath.files[0].path;
        if (this.props.handleGethDatadir) {
            this.props.handleGethDatadir(files);
        }
    };

    _addDirectory = (node) => {
        if (node) {
            node.webkitdirectory = true;
            this.gethDirPath = node;
        }
    };

    render () {
        const { cache, datadir, handleGethCacheSize, intl } = this.props;
        const { muiTheme } = this.context;
        const errorStyle = {
            color: muiTheme.palette.disabledColor,
            overflowX: 'visible',
            whiteSpace: 'nowrap'
        };
        const floatingLabelStyle = { color: muiTheme.palette.disabledColor, zIndex: 0 };
        const inputStyle = { color: muiTheme.palette.textColor };
        const selectStyle = { maxWidth: '120px' };

        return (
          <div>
            <SelectField
              errorStyle={errorStyle}
              errorText={intl.formatMessage(setupMessages.changeGethCacheSize)}
              floatingLabelStyle={floatingLabelStyle}
              floatingLabelText={intl.formatMessage(setupMessages.gethCacheSize)}
              value={cache || 512}
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
              value={datadir || ''}
              inputStyle={inputStyle}
              onClick={this._handleDialogOpen}
              onFocus={this._handleDialogOpen}
              fullWidth
            />
            <input
              type="file"
              ref={this._addDirectory}
              onChange={this._handleGethPath}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
          </div>
        );
    }
}

GethSettingsForm.propTypes = {
    cache: PropTypes.number,
    datadir: PropTypes.string,
    handleGethDatadir: PropTypes.func,
    handleGethCacheSize: PropTypes.func,
    intl: PropTypes.shape(),
};

GethSettingsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

export default GethSettingsForm;
