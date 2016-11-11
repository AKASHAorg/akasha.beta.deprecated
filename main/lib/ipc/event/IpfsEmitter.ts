import { AbstractEmitter } from './AbstractEmitter';
import { IpfsConnector, ipfsEvents } from '@akashaproject/ipfs-connector';
import { ipfsResponse } from './responses';
import channels from '../../channels';

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
                this.fireEvent(channels.client.ipfs.startService, ipfsResponse({ downloading: true }));
            }
        );
        return this;
    }

    private _started() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_STARTED,
            () => {
                this.fireEvent(channels.client.ipfs.startService, ipfsResponse({ started: true }));
            }
        );
        return this;
    }

    private _stopped() {
        IpfsConnector.getInstance().on(
            ipfsEvents.SERVICE_STOPPED,
            () => {
                this.fireEvent(channels.client.ipfs.stopService, ipfsResponse({ stopped: true }));
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
