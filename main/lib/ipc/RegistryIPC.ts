/// <reference path="../../typings/main.d.ts" />
import ModuleEmitter from './event/ModuleEmitter';
import { unpad } from 'ethereumjs-util';
import channels from '../channels';
import { mainResponse } from './event/responses';
import { constructed as contracts } from './contracts/index';
import { module as userModule } from './modules/auth/index';
import { module as profileModule } from './modules/profile/index';
import { profiles } from './modules/models/records';
import WebContents = Electron.WebContents;

class RegistryIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'registry';
        this.DEFAULT_MANAGED = ['getCurrentProfile', 'getByAddress'];
    }

    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._profileExists()
            ._getCurrentProfile()
            ._getByAddress()
            ._registerProfile()
            ._manager();
    }

    private _profileExists() {
        this.registerListener(
            channels.server[this.MODULE_NAME].profileExists,
            (event: any, data: ProfileExistsRequest) => {
                contracts.instance
                    .registry
                    .profileExists(data.username)
                    .then((exists: boolean) => {
                        const response: ProfileExistsResponse = mainResponse({
                            exists,
                            username: data.username
                        });
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].profileExists,
                            response,
                            event
                        );
                    })
                    .catch((error: Error) => {
                        const response: ProfileExistsResponse = mainResponse({
                            error: {
                                message: error.message,
                                from: { username: data.username }
                            }
                        });
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].profileExists,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    private _getCurrentProfile() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getCurrentProfile,
            (event: any) => {
                let response: CurrentProfileResponse;
                contracts.instance
                    .registry
                    .getMyProfile()
                    .then((address: string) => {
                        const addr = unpad(address);
                        response = (addr) ? mainResponse({ address }) : mainResponse({ address: addr });
                    })
                    .catch((error: Error) => {
                        response = mainResponse({ error: { message: error.message } });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getCurrentProfile,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _getByAddress() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getByAddress,
            (event: any, data: ProfileByAddressRequest) => {
                let response: ProfileByAddressResponse;
                contracts.instance
                    .registry
                    .getByAddress(data.ethAddress)
                    .then((address: string) => {
                        const addr = unpad(address);
                        response = mainResponse({ profileAddress: addr });
                    })
                    .catch((error: Error) => {
                        response = mainResponse({
                            error: {
                                message: error.message,
                                from: { ethAddress: data.ethAddress }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getByAddress,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _registerProfile() {
        this.registerListener(
            channels.server[this.MODULE_NAME].registerProfile,
            (event: any, data: ProfileCreateRequest) => {
                let response: ProfileCreateResponse;
                profileModule
                    .helpers
                    .create(data.ipfs)
                    .then((ipfsHash: string) => {
                        return contracts.instance
                            .registry
                            .register(data.username, ipfsHash, data.gas);
                    })
                    .then((txData: any) => {
                        return userModule.auth.signData(txData, data.token);
                    })
                    .then((tx: string) => {
                        response = mainResponse({ tx });
                    })
                    .catch((error: Error) => {
                        response = mainResponse({
                            error: {
                                message: error.message,
                                from: { address: data.username }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].registerProfile,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }
}

export default RegistryIPC;
