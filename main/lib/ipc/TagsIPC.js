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
            ._getTagsFrom()
            ._getCreateError()
            ._getTagsCreated()
            ._getIndexTagError()
            ._getIndexedTag()
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
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { tagId: data.tagId }
                    }
                });
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
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { tagName: data.tagName }
                    }
                });
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
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { tagName: data.tagName }
                    }
                });
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
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { tagId: data.tagId, address: data.address }
                    }
                });
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
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { address: data.address, tagId: data.tagId }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].isSubscribed, response, event);
            });
        });
        return this;
    }
    _getTagsFrom() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getTagsFrom, (event, data) => {
            let response;
            index_1.constructed.instance
                .tags
                .getTagsCount()
                .then((count) => {
                const tags = [];
                const start = (data.from) ? data.from : 0;
                const stop = (data.to) ? (data.to < count) ? data.to : count : count;
                for (let i = start; i < stop; i++) {
                    tags.push(index_1.constructed.instance
                        .tags
                        .getTagAt(i));
                }
                return Promise.all(tags);
            })
                .then((tags) => {
                response = responses_1.mainResponse({ tags, from: data.from, to: data.to });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: data.from
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getTagsFrom, response, event);
            });
        });
        return this;
    }
    _getCreateError() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getCreateError, (event, data) => {
            let response;
            index_1.constructed
                .instance
                .tags
                .getCreateError(data)
                .then((events) => {
                response = responses_1.mainResponse({ events });
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
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getCreateError, response, event);
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
    _getIndexTagError() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getIndexTagError, (event, data) => {
            let response;
            index_1.constructed
                .instance
                .indexedTags
                .getIndexTagError(data)
                .then((events) => {
                response = responses_1.mainResponse({ events });
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
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getIndexTagError, response, event);
            });
        });
        return this;
    }
    _getIndexedTag() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getIndexedTag, (event, data) => {
            let response;
            index_1.constructed
                .instance
                .indexedTags
                .getIndexedTag(data)
                .then((events) => {
                response = responses_1.mainResponse({ events });
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
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getIndexedTag, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TagsIPC;
//# sourceMappingURL=TagsIPC.js.map