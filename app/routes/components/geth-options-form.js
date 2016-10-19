import React, { Component, PropTypes } from 'react';
import { TextField, FlatButton, Checkbox, SelectField, MenuItem } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { setupMessages, generalMessages } from 'locale-data/messages';

const checkboxStyle = { marginTop: '20px' };
const floatingLabelStyle = {
    cursor: 'default',
    overflowX: 'visible',
    whiteSpace: 'nowrap'
};
const selectStyle = { maxWidth: '120px' };

class GethOptionsForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            cache: props.gethSettings.get('cache'),
            mine: props.gethSettings.get('mine') === '',
            autoDag: props.gethSettings.get('autodag') === '',
            fast: props.gethSettings.get('fast') === '',
            minerThreads: props.gethSettings.get('minerthreads') || 1,
            showSuccessMessage: false,
            isDirty: false
        };
    }

    componentWillReceiveProps (nextProps) {
        const { gethSettings } = this.props;
        const nextGethSettings = nextProps.gethSettings;
        if (JSON.stringify(gethSettings.toJS()) !== JSON.stringify(nextGethSettings.toJS())) {
            this.setState({
                showSuccessMessage: true
            });
        }
    }

    onCacheChange = (event, index, value) => {
        this.setState({
            cache: value,
            isDirty: true
        });
    }

    onMineChange = () => {
        this.setState({
            mine: !this.state.mine,
            isDirty: true
        });
    }

    onAutodagChange = () => {
        this.setState({
            autoDag: !this.state.autoDag,
            isDirty: true
        });
    }

    onFastChange = () => {
        this.setState({
            fast: !this.state.fast,
            isDirty: true
        });
    }

    onMinerThreadsChange = (event, index, value) => {
        this.setState({
            minerThreads: value,
            isDirty: true
        });
    };

    onSaveSettings = () => {
        const { settingsActions } = this.props;
        const { cache, mine, autoDag, fast, minerThreads } = this.state;

        settingsActions.saveSettings('geth', {
            cache,
            mine: mine ? '' : null,
            autodag: (mine && autoDag) ? '' : null,
            fast: (mine && fast) ? '' : null,
            minerthreads: mine ? minerThreads : null
        });
        this.setState({
            showSuccessMessage: false,
            isDirty: false
        });
    }

    renderMiningDetails () {
        const { intl } = this.props;
        const { palette } = this.context.muiTheme;
        const labelStyle = Object.assign({}, floatingLabelStyle, { color: palette.disabledColor });

        return <div style={{ marginLeft: '50px' }}>
          <Checkbox
            label={intl.formatMessage(setupMessages.gethAutodag)}
            checked={this.state.autoDag}
            style={checkboxStyle}
            onCheck={this.onAutodagChange}
          />
          <Checkbox
            label={intl.formatMessage(setupMessages.gethFast)}
            checked={this.state.fast}
            style={checkboxStyle}
            onCheck={this.onFastChange}
          />
          <SelectField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.gethMinerThreads)}
            value={this.state.minerThreads}
            onChange={this.onMinerThreadsChange}
            style={selectStyle}
          >
            <MenuItem key={1} value={1} primaryText="1" />
            <MenuItem key={2} value={2} primaryText="2" />
          </SelectField>
        </div>;
    }

    render () {
        const { intl, gethSettings, style } = this.props;
        const { palette } = this.context.muiTheme;
        const inputStyle = { color: palette.textColor };
        const labelStyle = Object.assign({}, floatingLabelStyle, { color: palette.disabledColor });

        return <div style={style}>
          <SelectField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.gethCacheSize)}
            value={this.state.cache}
            onChange={this.onCacheChange}
            style={selectStyle}
          >
            <MenuItem key={1} value={512} primaryText="512 MB" />
            <MenuItem key={2} value={1024} primaryText="1024 MB" />
            <MenuItem key={3} value={1536} primaryText="1536 MB" />
            <MenuItem key={4} value={2048} primaryText="2048 MB" />
          </SelectField>
          <Checkbox
            label={intl.formatMessage(setupMessages.gethMine)}
            checked={this.state.mine}
            style={checkboxStyle}
            onCheck={this.onMineChange}
          />
          {this.state.mine && this.renderMiningDetails()}
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
          {this.state.showSuccessMessage && !this.state.isDirty &&
            <div style={{ color: palette.accent3Color, marginTop: '15px' }}>
              {intl.formatMessage(setupMessages.saveGethSettingsSuccess)}
            </div>
          }
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FlatButton
              label={intl.formatMessage(generalMessages.save)}
              primary
              disabled={!this.state.isDirty}
              onClick={this.onSaveSettings}
            />
          </div>
        </div>;
    }
}

GethOptionsForm.propTypes = {
    intl: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    settingsActions: PropTypes.shape().isRequired,
    style: PropTypes.shape()
};

GethOptionsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
}

export default GethOptionsForm;
