"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const constants_1 = require("@akashaproject/common/constants");
function init(sp, getService) {
    const getShortProfile = Promise
        .coroutine(function* (hash, resolveAvatar) {
        const stash = getService(constants_1.CORE_MODULE.STASH);
        const settings = getService(constants_1.CORE_MODULE.SETTINGS);
        const ipfsConnector = getService(constants_1.CORE_MODULE.IPFS_CONNECTOR);
        if (stash.profiles.hasShort(hash)) {
            return Promise.resolve(stash.profiles.getShort(hash));
        }
        const avatarPath = { [constants_1.PROFILE_CONSTANTS.AVATAR]: '' };
        const aboutPath = { [constants_1.PROFILE_CONSTANTS.ABOUT]: '' };
        const waitTime = settings.get(constants_1.GENERAL_SETTINGS.OP_WAIT_TIME) || 15000;
        const profileBase = yield ipfsConnector.getInstance()
            .api.get(hash)
            .timeout(waitTime).catch(() => null);
        const avatar = yield ipfsConnector.getInstance()
            .api.findLinks(hash, [constants_1.PROFILE_CONSTANTS.AVATAR]).timeout(waitTime).catch(() => '');
        const about = yield ipfsConnector.getInstance()
            .api.findLinks(hash, [constants_1.PROFILE_CONSTANTS.ABOUT]).timeout(waitTime).catch(() => '');
        if (avatar.length) {
            if (!resolveAvatar) {
                avatarPath[constants_1.PROFILE_CONSTANTS.AVATAR] = avatar[0].multihash;
            }
            else {
                avatarPath[constants_1.PROFILE_CONSTANTS.AVATAR] = yield ipfsConnector.getInstance()
                    .api.getFile(avatar[0].multihash).timeout(waitTime).catch(() => '');
            }
        }
        if (about.length) {
            aboutPath[constants_1.PROFILE_CONSTANTS.ABOUT] = yield ipfsConnector.getInstance()
                .api.get(about[0].multihash).timeout(waitTime).catch(() => '');
        }
        const fetched = Object.assign({}, profileBase, avatarPath, aboutPath);
        stash.profiles.setShort(hash, fetched);
        return fetched;
    });
    const resolveProfile = Promise
        .coroutine(function* (hash, resolveImages) {
        const stash = getService(constants_1.CORE_MODULE.STASH);
        const settings = getService(constants_1.CORE_MODULE.SETTINGS);
        const ipfsConnector = getService(constants_1.CORE_MODULE.IPFS_CONNECTOR);
        if (stash.profiles.hasFull(hash)) {
            return Promise.resolve(stash.profiles.getFull(hash));
        }
        const constructed = {
            [constants_1.PROFILE_CONSTANTS.LINKS]: [],
            [constants_1.PROFILE_CONSTANTS.BACKGROUND_IMAGE]: '',
        };
        const waitTime = settings.get(constants_1.GENERAL_SETTINGS.OP_WAIT_TIME) || 15000;
        const shortProfile = yield getShortProfile(hash, resolveImages);
        const pool = yield ipfsConnector.getInstance()
            .api
            .findLinks(hash, [constants_1.PROFILE_CONSTANTS.LINKS, constants_1.PROFILE_CONSTANTS.BACKGROUND_IMAGE])
            .timeout(waitTime).catch(() => []);
        for (let i = 0; i < pool.length; i++) {
            constructed[pool[i].name] = yield ipfsConnector.getInstance()
                .api.get(pool[i].multihash).timeout(waitTime).catch(() => '');
        }
        const returned = Object.assign({}, shortProfile, constructed);
        stash.profiles.setFull(hash, returned);
        return returned;
    });
    const resolveService = function () {
        return resolveProfile;
    };
    const getShortProfileService = function () {
        return getShortProfile;
    };
    sp().service(constants_1.PROFILE_MODULE.resolveProfile, resolveService);
    sp().service(constants_1.PROFILE_MODULE.getShortProfile, getShortProfileService);
}
exports.default = init;
//# sourceMappingURL=ipfs.js.map