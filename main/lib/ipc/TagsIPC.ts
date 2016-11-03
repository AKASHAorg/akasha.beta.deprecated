/// <reference path="../../typings/main.d.ts" />
import { constructed as contracts } from './contracts/index';
import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import { mainResponse } from './event/responses';
import { module as userModule } from './modules/auth/index';
import WebContents = Electron.WebContents;

class TagsIPC extends ModuleEmitter {

    constructor() {
        super();
        this.MODULE_NAME = 'tags';
        this.DEFAULT_MANAGED = ['exists'];
    }

    /**
     *
     * @param webContents
     */
    public initListeners(webContents: WebContents) {
        this.webContents = webContents;
        this
            ._create()
            ._exists()
            ._getTagName()
            ._getTagId()
            ._getTagsCreated()
            ._checkFormat()
            ._manager();
    }

    /**
     *
     * @returns {TagsIPC}
     * @private
     */
    private _create() {
        this.registerListener(
            channels.server[this.MODULE_NAME].create,
            (event: any, data: TagCreateRequest) => {
                let response: TagCreateResponse;
                contracts.instance.tags
                    .add(data.tagName, data.gas)
                    .then((txData: any) => {
                        return userModule.auth.signData(txData, data.token);
                    })
                    .then((tx: string) => {
                        response = mainResponse({ tx });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { tagName: data.tagName }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].create,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    /**
     *
     * @returns {TagsIPC}
     * @private
     */
    private _exists() {
        this.registerListener(
            channels.server[this.MODULE_NAME].exists,
            (event: any, data: TagExistsRequest) => {
                let response: TagExistsResponse;
                contracts.instance
                    .tags
                    .exists(data.tagName)
                    .then((found: boolean) => {
                        response = mainResponse({ exists: found });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { tagName: data.tagName }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].exists,
                            response,
                            event
                        );
                    });
            });
        return this;
    }

    /**
     *
     * @returns {TagsIPC}
     * @private
     */
    private _getTagName() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getTagName,
            (event: any, data: TagAtIdRequest) => {
                let response: TagAtIdResponse;
                contracts.instance
                    .tags
                    .getTagName(data.tagId)
                    .then((tagName: string) => {
                        response = mainResponse({ tagName });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { tagId: data.tagId }
                            }

                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getTagName,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    /**
     *
     * @returns {TagsIPC}
     * @private
     */
    private _getTagId() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getTagId,
            (event: any, data: TagAtNameRequest) => {
                let response: TagAtNameResponse;
                contracts.instance
                    .tags
                    .getTagId(data.tagName)
                    .then((tagId: string) => {
                        response = mainResponse({ tagId });
                    })
                    .catch((err: Error) => {
                        response = mainResponse({
                            error: {
                                message: err.message,
                                from: { tagName: data.tagName }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getTagId,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _getTagsCreated() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getTagsCreated,
            (event: any, data: GenericFromEventRequest) => {
                let response: GenericFromEventResponse;
                contracts
                    .instance
                    .tags
                    .getTagsCreated(data)
                    .then((collection) => {
                        response = mainResponse({ collection });
                    })
                    .catch((error: Error) => {
                        response = mainResponse({
                            error: {
                                message: error.message,
                                from: { address: data.address }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getTagsCreated,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _checkFormat(){
        this.registerListener(
            channels.server[this.MODULE_NAME].checkFormat,
            (event: any, data: TagAtNameRequest) => {
                let response: any;
                contracts
                    .instance
                    .tags
                    .checkFormat(data.tagName)
                    .then((status) => {
                        response = mainResponse({ tagName: data.tagName, status});
                    })
                    .catch((error: Error) => {
                        response = mainResponse({
                            error: {
                                message: error.message,
                                from: { address: data.tagName }
                            }
                        });
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].checkFormat,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }
}

export default TagsIPC;
