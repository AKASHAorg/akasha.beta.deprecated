/// <reference path="../../typings/main.d.ts" />
import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import WebContents = Electron.WebContents;
import IpcMainEvent = Electron.IpcMainEvent;
import { mainResponse } from './event/responses';
import {module as userModule} from './modules/user/index';
import {constructed} from './contracts/index';
import { post as POST } from 'request';

const faucetToken = '8336abae5a97f017d2d0ef952a6a566d4bbed5cd22c7b524ae749673d5562b567af10937181b7bdea73edd25512fdb948b3b016034bb01c0d95f8f9beb68c914';
class AuthIPC extends ModuleEmitter {
    constructor() {
        super();
        this.MODULE_NAME = 'auth';
        this.DEFAULT_MANAGED = ['login', 'logout', 'requestEther'];
    }

    initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._login()
            ._logout()
            ._generateEthKey()
            ._getLocalIdentities()
            ._requestEther()
            ._manager();
    }

    private _login() {
        this.registerListener(
            channels.server[this.MODULE_NAME].login,
            (event: any, data: AuthLoginRequest) => {
                userModule
                    .auth
                    .login(data.account, data.password, data.rememberTime)
                    .then((response: any) => {
                        return this.fireEvent(
                            channels.client[this.MODULE_NAME].login,
                            mainResponse(response),
                            event
                        );
                    });
            });
        return this;
    }

    private _logout() {
        this.registerListener(
            channels.server[this.MODULE_NAME].logout,
            (event: any, data: AuthLogoutRequest) => {
                userModule
                    .auth
                    .logout();
                return this.fireEvent(
                    channels.client[this.MODULE_NAME].logout,
                    mainResponse({done: true}),
                    event
                );
            }
        );
        return this;
    }

    private _generateEthKey() {
        this.registerListener(
            channels.server[this.MODULE_NAME].generateEthKey,
            (event: any, data: AuthKeygenRequest) => {
                userModule
                    .auth
                    .generateKey(data.password)
                    .then((address: string) => {
                       this.fireEvent(
                           channels.client[this.MODULE_NAME].generateEthKey,
                           mainResponse({address})
                       );
                    })
                    .catch((err: Error) => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].generateEthKey,
                            mainResponse({error: {message: err.message}})
                        );
                    });
            }
        );
        return this;
    }

    private _getLocalIdentities() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getLocalIdentities,
            (event: any, data: any) => {
                constructed
                    .instance
                    .registry
                    .getLocalProfiles()
                    .then((list: [string[]]) => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getLocalIdentities,
                            mainResponse(list)
                        );
                    })
                    .catch((err: Error) => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getLocalIdentities,
                            mainResponse({error: {message: err.message}})
                        );
                    });
            }
        );
        return this;
    }

    private _requestEther() {
        this.registerListener(
            channels.server[this.MODULE_NAME].requestEther,
            (event: any, data: RequestEtherRequest) => {
                POST({
                        url: 'http://138.68.78.152:1337/get/faucet',
                        json: {address: data.address, token: faucetToken}
                    },
                    (err: Error, response: any, body: {tx: string}) => {
                        let data: any;
                        if (err) {
                           data = {error: {message: err.message}};
                        } else {
                            data = body;
                        }
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].requestEther,
                            mainResponse(data)
                        );
                    }
                );
            });
        return this;
    }
}

export default AuthIPC;
