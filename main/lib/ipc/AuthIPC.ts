/// <reference path="../../typings/main.d.ts" />
import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import WebContents = Electron.WebContents;
import IpcMainEvent = Electron.IpcMainEvent;
import { mainResponse } from './event/responses';
import {module as userModule} from './modules/user/index';
import {constructed} from './contracts/index';

class AuthIPC extends ModuleEmitter {
    constructor() {
        super();
        this.MODULE_NAME = 'auth';
        this.DEFAULT_MANAGED = ['login', 'logout'];
    }

    initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this._login()
            ._logout()
            ._generateEthKey()
            ._getLocalIdentities()
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
}

export default AuthIPC;
