import { AbstractEmitter } from './AbstractEmitter';
import { IpfsConnector, ipfsEvents } from '@akashaproject/ipfs-connector';
import { ipfsResponse } from './responses';
import channels from '../../channels';
import * as Promise from 'bluebird';

const peerId = '/ip4/46.101.103.114/tcp/4001/ipfs/QmYfXRuVWMWFRJxUSFPHtScTNR9CU2samRsTK15VFJPpvh';
abstract class IpfsEmitter extends AbstractEmitter {

    public attachEmitters() {
        this._download()
            ._catchCorrupted()
            ._catchFailed()
            ._catchError()
            ._started()
            ._stopped();
    }

    private _download() {
        IpfsConnector.getInstance().once(
            ipfsEvents.DOWNLOAD_STARTED,
            () => {
                this.fireEvent(channels.client.ipfs.startService, ipfsResponse({ downloading: true }, {}));
            }
        );
        return this;
    }

    private _started() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_STARTED,
            () => {
                IpfsConnector.getInstance()
                    .checkVersion()
                    .then(isValid => {
                        if (!isValid) {
                            IpfsConnector.getInstance().stop();
                            return Promise.delay(5000).then(() => {
                                return IpfsConnector.getInstance()
                                    .downloadManager
                                    .deleteBin()
                                    .delay(1000)
                                    .then(() => IpfsConnector.getInstance().start())
                            })
                        }
                        return IpfsConnector.getInstance()
                            .api
                            .apiClient
                            .bootstrap
                            .add(peerId, (err, data) => {
                                if (err) {
                                    console.log('add ipfs peer err ', err);
                                }
                                this.fireEvent(channels.client.ipfs.startService, ipfsResponse({ started: true }, {}));
                            });
                    })
            }
        );
        return this;
    }

    private _stopped() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_STOPPED,
            () => {
                this.fireEvent(channels.client.ipfs.stopService, ipfsResponse({ stopped: true }, {}));
            }
        );
        return this;
    }

    private _catchCorrupted() {
        IpfsConnector.getInstance().on(
            ipfsEvents.BINARY_CORRUPTED,
            (err: Error) => {
                this.fireEvent(
                    channels.client.ipfs.startService,
                    ipfsResponse({}, { message: err.message, fatal: true })
                );
            }
        );
        return this;
    }

    private _catchFailed() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_FAILED,
            (err: Error) => {
                this.fireEvent(
                    channels.client.ipfs.startService,
                    ipfsResponse({}, { message: err.message, fatal: true })
                );
            }
        );
        return this;
    }

    private _catchError() {
        IpfsConnector.getInstance().on(
            ipfsEvents.ERROR,
            (message: string) => {
                this.fireEvent(
                    channels.client.ipfs.startService,
                    ipfsResponse({}, { message })
                )
            });
        return this;
    }
}
export default IpfsEmitter;
