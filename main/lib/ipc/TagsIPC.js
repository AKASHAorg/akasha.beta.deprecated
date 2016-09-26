"use strict";
const index_1 = require('./contracts/index');
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const channels_1 = require('../channels');
const responses_1 = require('./event/responses');
const index_2 = require('./modules/auth/index');
class TagsIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'tags';
        this.DEFAULT_MANAGED = ['exists'];
    }
    initListeners(webContents) {
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
    _create() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].create, (event, data) => {
            let response;
            index_1.constructed.instance.tags
                .add(data.tagName, data.gas)
                .then((txData) => {
                return index_2.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].create, response, event);
            });
        });
        return this;
    }
    _exists() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].exists, (event, data) => {
            let response;
            index_1.constructed.instance
                .tags
                .exists(data.tagName)
                .then((found) => {
                response = responses_1.mainResponse({ exists: found });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].exists, response, event);
            });
        });
        return this;
    }
    _getTagAt() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getTagAt, (event, data) => {
            let response;
            index_1.constructed.instance
                .tags
                .getTagAt(data.tagId)
                .then((tagName) => {
                response = responses_1.mainResponse({ tagName });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getTagAt, response, event);
            });
        });
        return this;
    }
    _getTagId() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getTagId, (event, data) => {
            let response;
            index_1.constructed.instance
                .tags
                .getTagId(data.tagName)
                .then((tagId) => {
                response = responses_1.mainResponse({ tagId });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getTagId, response, event);
            });
        });
        return this;
    }
    _subscribe() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].subscribe, (event, data) => {
            let response;
            index_1.constructed.instance
                .indexedTags
                .subscribe(data.tagName, data.gas)
                .then((txData) => {
                return index_2.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].subscribe, response, event);
            });
        });
        return this;
    }
    _unsubscribe() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].unsubscribe, (event, data) => {
            let response;
            index_1.constructed.instance
                .indexedTags
                .unsubscribe(data.tagName, data.subPosition, data.gas)
                .then((txData) => {
                return index_2.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].unsubscribe, response, event);
            });
        });
        return this;
    }
    _getSubPosition() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getSubPosition, (event, data) => {
            let response;
            index_1.constructed.instance
                .indexedTags
                .getSubPosition(data.address, data.tagId)
                .then((position) => {
                response = responses_1.mainResponse({ position });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getSubPosition, response, event);
            });
        });
        return this;
    }
    _isSubscribed() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].isSubscribed, (event, data) => {
            let response;
            index_1.constructed.instance
                .indexedTags
                .isSubscribed(data.address, data.tagId)
                .then((subscribed) => {
                response = responses_1.mainResponse({ subscribed });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].isSubscribed, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TagsIPC;
//# sourceMappingURL=TagsIPC.js.map