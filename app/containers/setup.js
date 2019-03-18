import React, { Component } from "react";
import PropTypes from "prop-types";
import Redirect from "react-router-dom/Redirect";
import { injectIntl } from "react-intl";
import { Button, Radio, Select as AntdSelect } from "antd";
import { connect } from "react-redux";
import { saveConfiguration } from "../local-flux/actions/settings-actions";
import { toggleLightSyncMode } from "../local-flux/actions/app-actions";
import { settingsSelectors } from "../local-flux/selectors";
import { formMessages, generalMessages, setupMessages } from "../locale-data/messages";
import { GethCacheSelect, Icon, PathInputField, Select, StartScreen } from "../components";

const { Option } = AntdSelect;
const RadioGroup = Radio.Group;

const syncModes = {
    light: "light",
    fast: "fast"
};
const syncSettings = {
    advanced: "advanced",
    express: "express"
};

class Config extends Component {
    state = {
        cache: "512",
        gethDataDir: null,
        ipfsPath: null,
        isAdvanced: false,
        syncmode: syncModes.fast
    };

    componentWillMount () {
        const { gethSettings, ipfsSettings } = this.props;
        this.setState({
            cache: gethSettings.get("cache").toString(),
            gethDataDir: gethSettings.get("datadir"),
            ipfsPath: ipfsSettings.get("storagePath"),
            syncmode: gethSettings.get("syncmode")
        });
    }

    componentWillReceiveProps (nextProps) {
        const { gethSettings, ipfsSettings } = nextProps;
        if (!gethSettings.equals(this.props.gethSettings) || !ipfsSettings.equals(this.props.ipfsSettings)) {
            this.setState({
                cache: gethSettings.get("cache").toString(),
                gethDataDir: gethSettings.get("datadir"),
                ipfsPath: ipfsSettings.get("storagePath"),
                syncmode: gethSettings.get("syncmode")
            });
        }
    }

    onGethDatadirChange = gethDataDir => {
        this.setState({
            gethDataDir
        });
    };

    onGethCacheChange = value => {
        this.setState({
            cache: value
        });
    };

    onIpfsPathChange = ipfsPath => {
        this.setState({
            ipfsPath
        });
    };

    handleReset = () => {
        const { defaultGethSettings, defaultIpfsSettings } = this.props;
        this.setState({
            cache: defaultGethSettings.get("cache").toString(),
            gethDataDir: defaultGethSettings.get("datadir"),
            ipfsPath: defaultIpfsSettings.get("storagePath")
        });
    };

    handleSubmit = () => {
        const { defaultGethSettings, defaultIpfsSettings, saveConfiguration } = this.props;
        const { cache, gethDataDir, ipfsPath, isAdvanced, syncmode } = this.state;
        const geth = isAdvanced ? { cache: Number(cache), datadir: gethDataDir } : defaultGethSettings.toJS();
        // Uncomment this when syncmode will be supported on main
        geth.syncmode = syncmode;
        const ipfs = isAdvanced ? { storagePath: ipfsPath } : defaultIpfsSettings.toJS();
        saveConfiguration({ geth, ipfs });
    };

    onRadioChange = ev => {
        this.setState({
            isAdvanced: ev.target.value === syncSettings.advanced
        });
    };

    onSyncModeChange = val => {
        const { toggleLightSyncMode } = this.props;

        if (val === syncModes.light) {
            toggleLightSyncMode(true);
        } else {
            toggleLightSyncMode(false);
        }

        this.setState({
            syncmode: val
        });
    };
    renderAdvancedSettings = () => {
        const { intl } = this.props;
        const { cache, gethDataDir, ipfsPath } = this.state;

        return (
            <div style={{ paddingBottom: "10px" }}>
                <GethCacheSelect onChange={this.onGethCacheChange} style={{ width: "100%" }} value={cache} />
                <PathInputField
                    label={intl.formatMessage(setupMessages.gethDataDirPath)}
                    onChange={this.onGethDatadirChange}
                    value={gethDataDir}
                    size="large"
                />
                <PathInputField
                    label={intl.formatMessage(setupMessages.ipfsStoragePath)}
                    onChange={this.onIpfsPathChange}
                    value={ipfsPath}
                    size="large"
                />
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button className="flex-center-y configuration__reset-button" onClick={this.handleReset}>
                        <Icon type="reload" />
                        {intl.formatMessage(generalMessages.reset)}
                    </Button>
                </div>
            </div>
        );
    };

    render () {
        const { configurationSaved, intl, active } = this.props;
        const { isAdvanced, syncmode } = this.state;
        console.log("setup is active:", active);
        if (!active) {
            return null;
        }
        return (
            <div className="setup-content configuration">
                {configurationSaved && <Redirect to="/setup/synchronization" />}
                <div className="setup-content__column setup-pages_left">
                    <StartScreen />
                </div>
                <div className="setup-content__column setup-pages_right">
                    <div className="setup-content__column-content">
                        <div className="configuration__title">
                            {intl.formatMessage(setupMessages.syncOptions)}
                        </div>
                        <div className="configuration__form">
                            <Select
                                label={intl.formatMessage(formMessages.selectOneOption)}
                                onSelect={this.onSyncModeChange}
                                size="large"
                                style={{ width: "100%" }}
                                value={syncmode}
                            >
                                <Option value={syncModes.fast}>
                                    {intl.formatMessage(setupMessages.normalSync)}
                                </Option>
                                <Option value={syncModes.light}>
                                    {intl.formatMessage(setupMessages.lightSync)}
                                </Option>
                            </Select>
                            <RadioGroup
                                onChange={this.onRadioChange}
                                size="large"
                                value={isAdvanced ? syncSettings.advanced : syncSettings.express}
                            >
                                <Radio
                                    value={syncSettings.express}
                                    style={{ display: "inline-flex", alignItems: "center" }}
                                >
                                    {intl.formatMessage(setupMessages.expressSetup)}
                                </Radio>
                                <Radio
                                    value={syncSettings.advanced}
                                    style={{ display: "inline-flex", alignItems: "center" }}
                                >
                                    {intl.formatMessage(setupMessages.advancedSetup)}
                                </Radio>
                            </RadioGroup>
                            {isAdvanced && this.renderAdvancedSettings()}
                        </div>
                    </div>
                    <div className="setup-content__column-footer">
                        <Button onClick={this.handleSubmit} type="primary">
                            {intl.formatMessage(generalMessages.next)}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }
}

Config.propTypes = {
    configurationSaved: PropTypes.bool,
    defaultGethSettings: PropTypes.shape().isRequired,
    defaultIpfsSettings: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    intl: PropTypes.shape(),
    ipfsSettings: PropTypes.shape().isRequired,
    saveConfiguration: PropTypes.func.isRequired,
    toggleLightSyncMode: PropTypes.func
};

function mapStateToProps (state) {
    return {
        configurationSaved: settingsSelectors.getConfigurationSaved(state),
        defaultGethSettings: settingsSelectors.selectDefaultGethSettings(state),
        defaultIpfsSettings: settingsSelectors.selectDefaultIpfsSettings(state),
        gethSettings: settingsSelectors.selectGethSettings(state),
        ipfsSettings: settingsSelectors.selectIpfsSettings(state)
    };
}

export default connect(
    mapStateToProps,
    {
        saveConfiguration,
        toggleLightSyncMode
    },
    null,
    // this option will disable the "shouldComponentUpdate" method on the connected component
    // sCU will be removed in react-redux 6.0 anyway
    { pure: false }
)(injectIntl(Config));
