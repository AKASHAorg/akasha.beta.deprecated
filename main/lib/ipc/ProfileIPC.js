"use strict";
const geth_connector_1 = require('@akashaproject/geth-connector');
const index_1 = require('./modules/auth/index');
const index_2 = require('./modules/profile/index');
const ModuleEmitter_1 = require('./event/ModuleEmitter');
const index_3 = require('./contracts/index');
const channels_1 = require('../channels');
const settings_1 = require('./config/settings');
const responses_1 = require('./event/responses');
const Promise = require('bluebird');
class ProfileIPC extends ModuleEmitter_1.default {
    constructor() {
        super();
        this.MODULE_NAME = 'profile';
        this.DEFAULT_MANAGED = ['getProfileData', 'getMyBalance', 'getIpfs'];
    }
    initListeners(webContents) {
        this.webContents = webContents;
        this._getMyBalance()
            ._getProfileData()
            ._unregister()
            ._follow()
            ._getFollowers()
            ._getFollowersCount()
            ._getFollowing()
            ._getFollowingCount()
            ._updateProfileData()
            ._manager();
    }
    _getProfileData() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getProfileData, (event, data) => {
            let response;
            var s = Promise.coroutine(function* (data1) {
                const ipfsHash = yield index_3.constructed.instance.profile.getIpfs(data1.profile);
                const profile = (data1.full) ? yield index_2.module.helpers.resolveProfile(ipfsHash, data1.resolveImages) :
                    yield index_2.module.helpers.getShortProfile(ipfsHash, data1.resolveImages);
                const akashaId = yield index_3.constructed.instance.profile.getId(data1.profile);
                response = responses_1.mainResponse(Object.assign({ username: akashaId, [settings_1.BASE_URL]: settings_1.generalSettings.get(settings_1.BASE_URL), profile: data1.profile }, profile));
                return response;
            });
            s(data).catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: data.profile
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getProfileData, response, event);
            });
        });
        return this;
    }
    _updateProfileData() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].updateProfileData, (event, data) => {
            let response;
            index_2.module
                .helpers
                .create(data.ipfs)
                .then((ipfsHash) => {
                return index_3.constructed.instance
                    .registry
                    .getMyProfile()
                    .then((address) => {
                    if (!address) {
                        throw new Error('No profile found to update');
                    }
                    return index_3.constructed
                        .instance
                        .profile
                        .updateHash(ipfsHash, address, data.gas);
                });
            })
                .then((txData) => {
                return index_1.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: data.ipfs
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].updateProfileData, response, event);
            });
        });
        return this;
    }
    _getMyBalance() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getMyBalance, (event, data) => {
            let response;
            const etherBase = (data.etherBase) ? data.etherBase : geth_connector_1.GethConnector.getInstance().web3.eth.defaultAccount;
            return geth_connector_1.GethConnector.getInstance()
                .web3
                .eth
                .getBalanceAsync(etherBase)
                .then((weiAmount) => {
                const unit = (data.unit) ? data.unit : 'ether';
                const value = geth_connector_1.GethConnector.getInstance()
                    .web3
                    .fromWei(weiAmount, unit);
                if (!etherBase) {
                    throw new Error('No ethereum address specified');
                }
                response = responses_1.mainResponse({ value: value.toString(10), unit });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getMyBalance, response, event);
            });
        });
        return this;
    }
    _unregister() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].unregister, (event, data) => {
            let response;
            index_3.constructed
                .instance
                .profile
                .unregister(data.profileAddress)
                .then((txData) => {
                return index_1.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].unregister, response, event);
            });
        });
        return this;
    }
    _follow() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].follow, (event, data) => {
            let response;
            index_3.constructed.instance
                .feed
                .follow(data.profileAddress)
                .then((txData) => {
                return index_1.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx, profileAddress: data.profileAddress });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message, profileAddress: data.profileAddress } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].follow, response, event);
            });
        });
        return this;
    }
    _unFollow() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].unFollow, (event, data) => {
            let response;
            index_3.constructed.instance
                .feed
                .unFollow(data.profileAddress)
                .then((txData) => {
                return index_1.module.auth.signData(txData, data.token);
            })
                .then((tx) => {
                response = responses_1.mainResponse({ tx, profileAddress: data.profileAddress });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message, profileAddress: data.profileAddress } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].unFollow, response, event);
            });
        });
        return this;
    }
    _getFollowersCount() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getFollowersCount, (event, data) => {
            let response;
            index_3.constructed
                .instance
                .feed.getFollowersCount(data.profileId)
                .then((count) => {
                response = responses_1.mainResponse({ count, profileId: data.profileId });
            })
                .catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getFollowersCount, response, event);
            });
        });
        return this;
    }
    _getFollowingCount() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getFollowingCount, (event, data) => {
            let response;
            index_3.constructed
                .instance
                .feed
                .getFollowingCount(data.profileId)
                .then((count) => {
                response = responses_1.mainResponse({ count, profileId: data.profileId });
            }).catch((err) => {
                response = responses_1.mainResponse({ error: { message: err.message } });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getFollowingCount, response, event);
            });
        });
        return this;
    }
    _getFollowers() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getFollowers, (event, data) => {
            let response;
            index_3.constructed.instance.main.getFollowersCount(data.profileAddress)
                .then((count) => {
                const followers = [];
                const start = (data.from) ? data.from : 0;
                const stop = (data.to) ? (data.to < count) ? data.to : count : count;
                for (let i = start; i < stop; i++) {
                    followers.push(index_3.constructed.instance
                        .main
                        .getFollowerAt(data.profileAddress, i));
                }
                return Promise.all(followers);
            }).then((followers) => {
                response = responses_1.mainResponse({
                    followers,
                    from: data.from,
                    to: data.to,
                    profileAddress: data.profileAddress
                });
            }).catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: data.profileAddress
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getFollowers, response, event);
            });
        });
        return this;
    }
    _getFollowing() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].getFollowers, (event, data) => {
            let response;
            index_3.constructed.instance.main.getFollowingCount(data.profileAddress)
                .then((count) => {
                const following = [];
                const start = (data.from) ? data.from : 0;
                const stop = (data.to) ? (data.to < count) ? data.to : count : count;
                for (let i = start; i < stop; i++) {
                    following.push(index_3.constructed.instance
                        .main
                        .getFollowingAt(data.profileAddress, i));
                }
                return Promise.all(following);
            })
                .then((following) => {
                response = responses_1.mainResponse({
                    following,
                    from: data.from,
                    to: data.to,
                    profileAddress: data.profileAddress
                });
            }).catch((err) => {
                response = responses_1.mainResponse({
                    error: {
                        message: err.message,
                        from: data.profileAddress
                    }
                });
            })
                .finally(() => {
                this.fireEvent(channels_1.default.client[this.MODULE_NAME].getFollowing, response, event);
            });
        });
        return this;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ProfileIPC;
//# sourceMappingURL=ProfileIPC.js.map