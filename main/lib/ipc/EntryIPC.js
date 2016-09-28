"use strict";
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const channels_1 = require('../channels');
const index_1 = require('./contracts/index');
const responses_1 = require('./event/responses');
const index_2 = require('./modules/auth/index');
const Entry_1 = require('./modules/models/Entry');
class EntryIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'entry';
        this.DEFAULT_MANAGED = ['getVoteEndDate', 'getScore'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this
            ._publish()
            ._downvote()
            ._update()
            ._upvote()
            ._isOpenedToVotes()
            ._getVoteOf()
            ._getVoteEndDate()
            ._getScore()
            ._getEntriesCount()
            ._getEntryOf()
            ._getEntry()
            ._manager();
    }
    _publish() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].create, (event, data) => {
            let response;
            const entry = new Entry_1.default();
            entry.create(data.content, data.tags)
                .then((hash) => {
                return index_1.constructed.instance
                    .main
                    .publishEntry(hash, data.tags, data.gas);
            })
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
    _update() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].update, (event, data) => {
            let response;
            const entry = new Entry_1.default();
            entry.load(data.hash);
            index_1.constructed.instance
                .main
                .updateEntry(data.hash, data.address, data.gas)
                .then((txData) => {
                return index_2.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message, from: { address: data.address } } });
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
                .upVoteEntry(data.address, data.weight, data.gas, data.value)
                .then((txData) => {
                return index_2.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message, from: { address: data.address } } });
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
                .downVoteEntry(data.address, data.weight, data.gas, data.value)
                .then((txData) => {
                return index_2.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message, from: { address: data.address } } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].downvote, response, event);
            });
        });
        return this;
    }
    _isOpenedToVotes() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].isOpenedToVotes, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .openedToVotes(data.address)
                .then((status) => {
                response = responses_1.mainResponse({ address: data.address, voting: status });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message, from: { address: data.address } } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].isOpenedToVotes, response, event);
            });
        });
        return this;
    }
    _getVoteOf() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getVoteOf, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .getVoteOf(data.profile, data.address)
                .then((weight) => {
                response = responses_1.mainResponse({ profile: data.profile, weight });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message, from: { address: data.address, profile: data.profile } } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getVoteOf, response, event);
            });
        });
        return this;
    }
    _getVoteEndDate() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getVoteEndDate, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .voteEndDate(data.address)
                .then((endDate) => {
                response = responses_1.mainResponse({ address: data.address, date: endDate });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message, from: { address: data.address } } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getVoteEndDate, response, event);
            });
        });
        return this;
    }
    _getScore() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getScore, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .getScoreOfEntry(data.address)
                .then((score) => {
                response = responses_1.mainResponse({ address: data.address, score });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { address: data.address }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getScore, response, event);
            });
        });
        return this;
    }
    _getEntriesCount() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getEntriesCount, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .getEntriesCount(data.profileAddress)
                .then((score) => {
                response = responses_1.mainResponse({ profileAddress: data.profileAddress, score });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { profileAddress: data.profileAddress }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getEntriesCount, response, event);
            });
        });
        return this;
    }
    _getEntryOf() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getEntryOf, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .getEntryOf(data.profileAddress, data.position)
                .then((content) => {
                response = responses_1.mainResponse({ profileAddress: data.profileAddress, content });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { profileAddress: data.profileAddress }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getEntryOf, response, event);
            });
        });
        return this;
    }
    _getEntry() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getEntry, (event, data) => {
            let response;
            index_1.constructed.instance
                .main
                .getEntry(data.entryAddress)
                .then((content) => {
                response = responses_1.mainResponse({ entryAddress: data.entryAddress, content });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: { entryAddress: data.entryAddress }
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getEntry, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EntryIPC;
//# sourceMappingURL=EntryIPC.js.map