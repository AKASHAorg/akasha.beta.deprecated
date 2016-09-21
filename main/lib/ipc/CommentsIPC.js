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
                response = responses_1.mainResponse({ tx: tx });
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
                response = responses_1.mainResponse({ tx: tx });
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
                response = responses_1.mainResponse({ tx: tx });
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
                response = responses_1.mainResponse({ tx: tx });
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
                response = responses_1.mainResponse({ address: data.address, score: score });
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CommentsIPC;
//# sourceMappingURL=CommentsIPC.js.map