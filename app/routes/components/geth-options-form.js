import React, { Component, PropTypes } from 'react';
import { TextField, Checkbox, SelectField, MenuItem } from 'material-ui';
import { setupMessages } from 'locale-data/messages';

const checkboxStyle = { marginTop: '20px' };
const floatingLabelStyle = {
    cursor: 'default',
    overflowX: 'visible',
    whiteSpace: 'nowrap'
};
const selectStyle = { maxWidth: '120px' };

class GethOptionsForm extends Component {

    renderMiningDetails () {
        const { intl, onAutodagChange, onFastChange, onMinerThreadsChange } = this.props;
        const { palette } = this.context.muiTheme;
        const labelStyle = Object.assign({}, floatingLabelStyle, { color: palette.disabledColor });

        return (<div style={{ marginLeft: '50px' }}>
          <Checkbox
            label={intl.formatMessage(setupMessages.gethAutodag)}
            checked={this.props.autoDag}
            style={checkboxStyle}
            onCheck={onAutodagChange}
          />
          <Checkbox
            label={intl.formatMessage(setupMessages.gethFast)}
            checked={this.props.fast}
            style={checkboxStyle}
            onCheck={onFastChange}
          />
          <SelectField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.gethMinerThreads)}
            value={this.props.minerThreads}
            onChange={onMinerThreadsChange}
            style={selectStyle}
          >
            <MenuItem key={1} value={1} primaryText="1" />
            <MenuItem key={2} value={2} primaryText="2" />
          </SelectField>
        </div>);
    }

    render () {
        const { intl, gethSettings, style, onCacheChange, onMineChange } = this.props;
        const { palette } = this.context.muiTheme;
        const inputStyle = { color: palette.textColor };
        const labelStyle = Object.assign({}, floatingLabelStyle, { color: palette.disabledColor });

        return (<div style={style}>
          <SelectField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.gethCacheSize)}
            value={this.props.cache}
            onChange={onCacheChange}
            style={selectStyle}
          >
            <MenuItem key={1} value={512} primaryText="512 MB" />
            <MenuItem key={2} value={1024} primaryText="1024 MB" />
            <MenuItem key={3} value={1536} primaryText="1536 MB" />
            <MenuItem key={4} value={2048} primaryText="2048 MB" />
          </SelectField>
          <Checkbox
            label={intl.formatMessage(setupMessages.gethMine)}
            checked={this.props.mine}
            style={checkboxStyle}
            onCheck={onMineChange}
          />
          {this.props.mine && this.renderMiningDetails()}
          <TextField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.gethDataDirPath)}
            floatingLabelFixed
            value={gethSettings.get('datadir') || ''}
            inputStyle={inputStyle}
            fullWidth
            disabled
          />
          <TextField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.gethIPCPath)}
            floatingLabelFixed
            value={gethSettings.get('ipcpath') || ''}
            inputStyle={inputStyle}
            fullWidth
            disabled
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
          {this.props.showSuccessMessage &&
            <div style={{ color: palette.accent3Color, marginTop: '15px' }}>
              {intl.formatMessage(setupMessages.saveGethSettingsSuccess)}
            </div>
          }
        </div>);
    }
}

GethOptionsForm.propTypes = {
    intl: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    onAutodagChange: PropTypes.func.isRequired,
    onFastChange: PropTypes.func.isRequired,
    onMinerThreadsChange: PropTypes.func.isRequired,
    onMineChange: PropTypes.func.isRequired,
    onCacheChange: PropTypes.func.isRequired,
    cache: PropTypes.number,
    mine: PropTypes.bool,
    autoDag: PropTypes.bool,
    fast: PropTypes.bool,
    minerThreads: PropTypes.number,
    showSuccessMessage: PropTypes.bool
};

GethOptionsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

export default GethOptionsForm;
