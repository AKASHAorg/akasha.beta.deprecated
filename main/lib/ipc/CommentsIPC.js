"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const channels_1 = require('../channels');
const index_1 = require('./contracts/index');
const responses_1 = require('./event/responses');
const index_2 = require('./modules/auth/index');
class CommentsIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'comments';
        this.DEFAULT_MANAGED = ['getScore'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this
            ._publish()
            ._update()
            ._upvote()
            ._downvote()
            ._getScore()
            ._getCount()
            ._getCommentAt()
            ._manager();
    }
    _publish() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].publish, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .saveComment(data.address, data.hash, data.gas)
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
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].publish, response, event);
            });
        });
        return this;
    }
    _update() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].update, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .updateComment(data.address, data.commentId, data.hash, data.gas)
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
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].update, response, event);
            });
        });
        return this;
    }
    _upvote() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].upvote, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .upVoteComment(data.address, data.weight, data.commentId, data.gas, data.value)
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
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].upvote, response, event);
            });
        });
        return this;
    }
    _downvote() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].downvote, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .downVoteComment(data.address, data.weight, data.commentId, data.gas, data.value)
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
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].downvote, response, event);
            });
        });
        return this;
    }
    _getScore() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getScore, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .getScoreOfComment(data.address, data.commentId)
                .then((score) => {
                response = responses_1.mainResponse({ address: data.address, score });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getScore, response, event);
            });
        });
        return this;
    }
    _getCount() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getCount, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .getCommentsCount(data.address)
                .then((count) => {
                response = responses_1.mainResponse({ count, address: data.address });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        address: data.address
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getCount, response, event);
            });
        });
        return this;
    }
    _getCommentAt() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getCommentAt, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .getCommentAt(data.address, data.id)
                .then((mediaObj) => {
                response = responses_1.mainResponse({
                    hash: mediaObj._hash,
                    owner: mediaObj._owner,
                    date: mediaObj._date,
                    address: data.address,
                    id: data.id
                });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        address: data.address,
                        id: data.id
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getCommentAt, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommentsIPC;
//# sourceMappingURL=CommentsIPC.js.map