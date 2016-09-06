/// <reference path="../../typings/main.d.ts" />
import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import { mainResponse } from './event/responses';
import {constructed as contracts} from './contracts/index';
import WebContents = Electron.WebContents;

class RegistryIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'registry';
        this.DEFAULT_MANAGED = ['getCurrentProfile', 'getByAddress'];
    }

    initListeners(webContents: WebContents) {
        this.webContents = webContents;
    }

    private _profileExists() {
        this.registerListener(
            channels.server[this.MODULE_NAME].profileExists,
            (event: any, data: ProfileExistsRequest) => {
                contracts.instance
                    .registry
                    .profileExists(data.username)
                    .then((exists: boolean) => {
                        const response: ProfileExistsResponse = mainResponse({ exists, username: data.username });
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].profileExists,
                            response
                        );
                    })
                    .catch((error: Error) => {
                        const response: ProfileExistsResponse = mainResponse({ error });
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].profileExists,
                            response
                        );
                    });
            });
        return this;
    }
}
