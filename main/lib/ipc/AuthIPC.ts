/// <reference path="../../typings/main.d.ts" />
import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import { mainResponse } from './event/responses';
import { module as userModule } from './modules/auth/index';
import { constructed } from './contracts/index';
import { post as POST } from 'request';
import WebContents = Electron.WebContents;

const faucetToken = '8336abae5a97f017d2d0ef952a6a566d4bbed5cd22c7b524ae749673d5562b567af109371' +
    '81b7bdea73edd25512fdb948b3b016034bb01c0d95f8f9beb68c914';

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
                    .login(data.account, data.password, data.rememberTime, data.registering)
                    .then((response: any) => {
                        const response1: AuthLoginResponse = mainResponse(response);
                        return this.fireEvent(
                            channels.client[this.MODULE_NAME].login,
                            response1,
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
                const response: AuthLogoutResponse = mainResponse({ done: true });
                return this.fireEvent(
                    channels.client[this.MODULE_NAME].logout,
                    response,
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
                        const response: AuthKeygenResponse = mainResponse({ address });
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].generateEthKey,
                            response,
                            event
                        );
                    })
                    .catch((error: Error) => {
                        const response: AuthKeygenResponse = mainResponse({ error });
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].generateEthKey,
                            response,
                            event
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
                let response: LocalProfilesResponse;
                constructed
                    .instance
                    .registry
                    .getLocalProfiles()
                    .then((list: {key: string, profile: string}[]) => {
                        response = mainResponse(list);
                    })
                    .catch((err: Error) => {
                        response = mainResponse({ error: { message: err.message } });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getLocalIdentities,
                            response,
                            event
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
                        url: 'https://138.68.78.152:1337/get/faucet',
                        json: { address: data.address, token: faucetToken },
                        agentOptions: { rejectUnauthorized: false }
                    },
                    (error: Error, response: any, body: {tx: string}) => {
                        const data = (error) ? { error } : body;
                        const response1: RequestEtherResponse = mainResponse(data);
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].requestEther,
                            response1,
                            event
                        );
                    }
                );
            });
        return this;
    }
}

export default AuthIPC;
