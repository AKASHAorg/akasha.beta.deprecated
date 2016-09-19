/// <reference path="../../typings/main.d.ts" />
import {constructed as contracts} from './contracts/index';
import ModuleEmitter from './event/ModuleEmitter';
import channels from '../channels';
import WebContents = Electron.WebContents;
import { mainResponse } from './event/responses';
import { module as userModule } from './modules/auth/index';

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
            ._getTagAt()
            ._getTagId()
            ._getSubPosition()
            ._isSubscribed()
            ._subscribe()
            ._unsubscribe()
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
                        response = mainResponse({tx});
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: {message: err.message}});
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
                        response = mainResponse({exists: found});
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: {message: err.message}});
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
    private _getTagAt() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getTagAt,
            (event: any, data: TagAtIdRequest) => {
                let response: TagAtIdResponse;
                contracts.instance
                    .tags
                    .getTagAt(data.tagId)
                    .then((tagName: string) => {
                       response = mainResponse({tagName});
                    })
                    .catch((err: Error) => {
                       response = mainResponse({error: {message: err.message}});
                    })
                    .finally(() => {
                       this.fireEvent(
                           channels.client[this.MODULE_NAME].getTagAt,
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
                        response = mainResponse({tagId});
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: {message: err.message}});
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

    /**
     *
     * @private
     */
    private _subscribe() {
        this.registerListener(
            channels.server[this.MODULE_NAME].subscribe,
            (event: any, data: TagSubscribeRequest) => {
                let response: TagSubscribeResponse;
                contracts.instance
                    .indexedTags
                    .subscribe(data.tagName, data.gas)
                    .then((txData: any) => {
                        return userModule.auth.signData(txData, data.token);
                    })
                    .then((tx: string) => {
                        response = mainResponse({tx});
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: {message: err.message}});
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].subscribe,
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
    private _unsubscribe() {
        this.registerListener(
            channels.server[this.MODULE_NAME].unsubscribe,
            (event: any, data: TagUnSubscribeRequest) => {
                let response: TagUnSubscribeResponse;
                contracts.instance
                    .indexedTags
                    .unsubscribe(data.tagName, data.subPosition, data.gas)
                    .then((txData: any) => {
                        return userModule.auth.signData(txData, data.token);
                    })
                    .then((tx: string) => {
                        response = mainResponse({tx});
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: {message: err.message}});
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].unsubscribe,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _getSubPosition() {
        this.registerListener(
            channels.server[this.MODULE_NAME].getSubPosition,
            (event: any, data: TagGetSubPositionRequest) => {
                let response: TagGetSubPositionResponse;
                contracts.instance
                    .indexedTags
                    .getSubPosition(data.address, data.tagId)
                    .then((position: string) => {
                        response = mainResponse({position});
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: {message: err.message}});
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].getSubPosition,
                            response,
                            event
                        );
                    });
            }
        );
        return this;
    }

    private _isSubscribed() {
        this.registerListener(
            channels.server[this.MODULE_NAME].isSubscribed,
            (event: any, data: TagIsSubscribedRequest) => {
                let response: TagIsSubscribedResponse;
                contracts.instance
                    .indexedTags
                    .isSubscribed(data.address, data.tagId)
                    .then((subscribed: boolean) => {
                        response = mainResponse({subscribed});
                    })
                    .catch((err: Error) => {
                        response = mainResponse({error: {message: err.message}});
                    })
                    .finally(() => {
                        this.fireEvent(
                            channels.client[this.MODULE_NAME].isSubscribed,
                            response,
                            event
                        );
                    });
            });
        return this;
    }
}

export default TagsIPC;
