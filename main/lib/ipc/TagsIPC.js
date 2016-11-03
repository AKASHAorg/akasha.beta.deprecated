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
            ._getTagName()
            ._getTagId()
            ._getTagsCreated()
            ._checkFormat()
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
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { tagName: data.tagName }
                    }
                });
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
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { tagName: data.tagName }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].exists, response, event);
            });
        });
        return this;
    }
    _getTagName() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getTagName, (event, data) => {
            let response;
            index_1.constructed.instance
                .tags
                .getTagName(data.tagId)
                .then((tagName) => {
                response = responses_1.mainResponse({ tagName });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { tagId: data.tagId }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getTagName, response, event);
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
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { tagName: data.tagName }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getTagId, response, event);
            });
        });
        return this;
    }
    _getTagsCreated() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getTagsCreated, (event, data) => {
            let response;
            index_1.constructed
                .instance
                .tags
                .getTagsCreated(data)
                .then((collection) => {
                response = responses_1.mainResponse({ collection });
            })
                .catch((error) => {
                response = responses_1.mainResponse({
                    error: {
                        message: error.message,
                        from: { address: data.address }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getTagsCreated, response, event);
            });
        });
        return this;
    }
    _checkFormat() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].checkFormat, (event, data) => {
            let response;
            index_1.constructed
                .instance
                .tags
                .checkFormat(data.tagName)
                .then((status) => {
                response = responses_1.mainResponse({ tagName: data.tagName, status });
            })
                .catch((error) => {
                response = responses_1.mainResponse({
                    error: {
                        message: error.message,
                        from: { address: data.tagName }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].checkFormat, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TagsIPC;
//# sourceMappingURL=TagsIPC.js.map