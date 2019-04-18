import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import { generalMessages, setupMessages } from '../../locale-data/messages';
import { toggleGethDetailsModal } from '../../local-flux/actions/app-actions';
import {
    gethPauseSync,
    gethResumeSync,
    gethStart,
    gethStop,
} from '../../local-flux/actions/external-process-actions';
import { gethSaveSettings } from '../../local-flux/actions/settings-actions';
import { GethCacheSelect, Input, LogsList, PathInputField, ServiceDetailsModal } from '../index';
import { externalProcessSelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';

const { TabPane } = Tabs;

const LOGS = 'LOGS';
const SETTINGS = 'SETTINGS';

class GethDetailsModal extends Component {
    state = {
        activeTab: SETTINGS,
        cache: this.props.gethSettings.get('cache').toString(),
        datadir: this.props.gethSettings.get('datadir'),
        isFormDirty: false,
    };

    onToggle = () => {
        /* eslint-disable */
        const { gethPauseSync, dispatchAction } = this.props;
        /* eslint-enable */
        if (this.isGethOn()) {
            dispatchAction(gethStop());
            gethPauseSync();
        } else {
            dispatchAction(gethStart());
        }
    };

    onCacheChange = (value) => {
        this.setState({
            cache: value,
            isFormDirty: true
        });
    };

    onDatadirChange = (datadir) => {
        this.setState({
            datadir,
            isFormDirty: true
        });
    }

    isGethOn = () => {
        const { gethStarting, gethStatus } = this.props;
        return gethStatus.get('process') || gethStatus.get('starting') || gethStarting;
    }

    selectTab = (tab) => {
        this.setState({
            activeTab: tab
        });
    };

    saveOptions = () => {
        const { cache, datadir } = this.state;

        this.props.gethSaveSettings({
            cache: Number(cache),
            datadir
        }, true);
        this.setState({
            isFormDirty: false,
        });
    };

    renderModalContent = () => {
        const { gethSettings, gethLogs, intl } = this.props;
        const { activeTab, cache, datadir } = this.state;

        return (
            <div className="service-details-modal geth-details-modal">
                <Tabs
                    activeKey={ activeTab }
                    onChange={ this.selectTab }
                    tabBarStyle={ { height: '60px', marginBottom: '0px' } }
                    type="card"
                >
                    <TabPane key={ SETTINGS } tab={ intl.formatMessage(generalMessages.settings) }>
                        <div className="service-details-modal__tab-pane">
                            <div className="geth-details-modal__split">
                                <GethCacheSelect
                                    onChange={ this.onCacheChange }
                                    style={ { width: '100%' } }
                                    value={ cache }
                                    wrapperStyle={ { width: '48%' } }
                                />
                                <Input
                                    label={ intl.formatMessage(setupMessages.gethNetworkId) }
                                    disabled
                                    size="large"
                                    value={ gethSettings.get('networkid') || '' }
                                    wrapperStyle={ { width: '48%' } }
                                />
                            </div>
                            <PathInputField
                                label={ intl.formatMessage(setupMessages.gethDataDirPath) }
                                onChange={ this.onDatadirChange }
                                readOnly
                                size="large"
                                value={ datadir }
                            />
                            <PathInputField
                                disabled
                                label={ intl.formatMessage(setupMessages.gethIPCPath) }
                                readOnly
                                size="large"
                                value={ gethSettings.get('ipcpath') }
                            />
                        </div>
                    </TabPane>
                    <TabPane key={ LOGS } tab={ intl.formatMessage(generalMessages.logs) }>
                        <div
                            className="service-details-modal__tab-pane service-details-modal__tab-pane_logs">
                            { activeTab === LOGS &&
                            <LogsList
                                logs={ gethLogs }
                                modal
                                startLogger={ this.props.gethStartLogger }
                                stopLogger={ this.props.gethStopLogger }
                            />
                            }
                        </div>
                    </TabPane>
                </Tabs>
            </div>
        );
    };

    render () {
        const { gethBusyState, gethStatus, intl, syncActionId } = this.props;
        const { isFormDirty } = this.state;
        const toggleDisabled = gethBusyState || gethStatus.get('downloading') || gethStatus.get('upgrading') ||
            syncActionId === 1;
        const isGethOn = this.isGethOn();
        const toggleLabel = isGethOn ?
            intl.formatMessage(generalMessages.gethServiceOn) :
            intl.formatMessage(generalMessages.gethServiceOff);

        return (
            <ServiceDetailsModal
                onCancel={ this.props.toggleGethDetailsModal }
                onSave={ this.saveOptions }
                onToggle={ this.onToggle }
                saveDisabled={ !isFormDirty }
                toggleDisabled={ toggleDisabled }
                toggleLabel={ toggleLabel }
                toggleOn={ isGethOn }
            >
                { this.renderModalContent() }
            </ServiceDetailsModal>
        );
    }
}

GethDetailsModal.propTypes = {
    gethBusyState: PropTypes.bool,
    gethLogs: PropTypes.shape().isRequired,
    gethSaveSettings: PropTypes.func.isRequired,
    gethSettings: PropTypes.shape(),
    gethStart: PropTypes.func,
    gethStarting: PropTypes.bool,
    gethStartLogger: PropTypes.func,
    gethStatus: PropTypes.shape().isRequired,
    gethStop: PropTypes.func,
    gethStopLogger: PropTypes.func,
    intl: PropTypes.shape().isRequired,
    syncActionId: PropTypes.number,
    toggleGethDetailsModal: PropTypes.func,
};

function mapStateToProps (state) {
    return {
        gethBusyState: externalProcessSelectors.getGethBusyState(state),
        gethLogs: externalProcessSelectors.selectGethLogs(state),
        gethSettings: externalProcessSelectors.selectGeth(state),
        gethStarting: externalProcessSelectors.getGethStarting(state),
        gethStatus: externalProcessSelectors.selectGethStatus(state),
        gethSyncStatus: externalProcessSelectors.selectGethSyncStatus(state),
        syncActionId: externalProcessSelectors.selectGethSyncActionId(state),
    };
}

export default connect(
    mapStateToProps,
    {
        gethPauseSync,
        gethResumeSync,
        gethSaveSettings,
        // gethStart,
        /* gethStartLogger, */
        // gethStop,
        /* gethStopLogger, */
        toggleGethDetailsModal,
    }
)(injectIntl(withRequest(GethDetailsModal)));
