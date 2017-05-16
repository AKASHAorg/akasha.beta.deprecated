import { CONSTANTS, GethConnector } from '@akashaproject/geth-connector';
import { AbstractEmitter } from './AbstractEmitter';
import channels from '../../channels';
import { gethResponse } from './responses';
import { constructed } from '../contracts/index';
import { initModules } from '../modules/index';
const peers = require('../config/peers.json');

abstract class GethEmitter extends AbstractEmitter {
    public attachEmitters() {
        this._download()
            ._error()
            ._fatal()
            ._starting()
            ._started()
            ._upgrading()
            ._stopped();
    }

    private _download() {
        GethConnector.getInstance().on(
            CONSTANTS.DOWNLOADING_BINARY, () => {
                this.fireEvent(channels.client.geth.startService, gethResponse({ downloading: true }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STARTING
     * @returns {GethEmitter}
     * @private
     */
    private _starting() {
        GethConnector.getInstance().on(
            CONSTANTS.STARTING, () => {
                this.fireEvent(channels.client.geth.startService, gethResponse({ starting: true }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STARTED
     * @returns {GethEmitter}
     * @private
     */
    private _started() {
        GethConnector.getInstance().on(
            CONSTANTS.STARTED, () => {
                this.fireEvent(channels.client.geth.startService, gethResponse({ started: true }, {}));
            }
        );

        GethConnector.getInstance().on(
            CONSTANTS.IPC_CONNECTED, () => {
                this.fireEvent(channels.client.geth.startService, gethResponse({}, {}));
                // inject web3 instance
                constructed.init(GethConnector.getInstance().web3);
                // wait for ipc connection
                initModules();
                // add static peers
                peers.list.forEach((peer: string) => {
                    GethConnector.getInstance().web3.admin.addPeerAsync(peer).then(() => null);
                });
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#STOPPED
     * @returns {GethEmitter}
     * @private
     */
    private _stopped() {
        GethConnector.getInstance().on(
            CONSTANTS.STOPPED, () => {
                this.fireEvent(channels.client.geth.stopService, gethResponse({ stopped: true }, {}));
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#FATAL
     * @returns {GethEmitter}
     * @private
     */
    private _fatal() {
        GethConnector.getInstance().on(
            CONSTANTS.FATAL, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    gethResponse({}, { message, fatal: true })
                );
            }
        );
        return this;
    }

    /**
     * Forward @event GethConnector#ERROR
     * @returns {GethEmitter}
     * @private
     */
    private _error() {
        GethConnector.getInstance().on(
            CONSTANTS.ERROR, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    gethResponse({}, { message })
                );
            }
        );
        return this;
    }

    /**
     * Notify when upgrading geth version
     * @returns {GethEmitter}
     * @private
     */
    private _upgrading() {
        GethConnector.getInstance().once(
            CONSTANTS.UPDATING_BINARY, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    gethResponse({ upgrading: true, message }, {})
                );
            }
        );
        GethConnector.getInstance().once(
            CONSTANTS.BINARY_CORRUPTED, (message: string) => {
                this.fireEvent(channels.client.geth.startService,
                    gethResponse({}, { message })
                );
            }
        );
        return this;
    }
}
export default GethEmitter;
