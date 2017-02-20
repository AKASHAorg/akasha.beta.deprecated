"use strict";
const ipfs_connector_1 = require("@akashaproject/ipfs-connector");
const records_1 = require("../models/records");
const ramda_1 = require("ramda");
const Promise = require("bluebird");
exports.ProfileSchema = {
    AVATAR: 'avatar',
    LINKS: 'links',
    ABOUT: 'about',
    BACKGROUND_IMAGE: 'backgroundImage'
};
exports.create = Promise.coroutine(function* (data) {
    let saved, tmp, targetHash, keys, pool;
    let i = 0;
    const simpleLinks = [exports.ProfileSchema.AVATAR, exports.ProfileSchema.ABOUT, exports.ProfileSchema.LINKS];
    const root = yield ipfs_connector_1.IpfsConnector.getInstance().api.add({ firstName: data.firstName, lastName: data.lastName });
    targetHash = root.hash;
    while (i < simpleLinks.length) {
        if (!ramda_1.isEmpty(data[simpleLinks[i]]) && data[simpleLinks[i]]) {
            tmp = yield ipfs_connector_1.IpfsConnector.getInstance().api.add(data[simpleLinks[i]], simpleLinks[i] === exports.ProfileSchema.AVATAR);
            saved = yield ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .addLink({ name: simpleLinks[i], size: tmp.size, hash: tmp.hash }, targetHash);
            targetHash = saved.multihash;
        }
        i++;
    }
    if (data.backgroundImage) {
        keys = Object.keys(data.backgroundImage).sort();
        pool = keys.map((media) => {
            return ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .addFile(data.backgroundImage[media].src);
        });
        tmp = yield Promise.all(pool).then((returned) => {
            const constructed = {};
            returned.forEach((v, i) => {
                const dim = keys[i];
                constructed[dim] = {};
                constructed[dim]['width'] = data.backgroundImage[dim].width;
                constructed[dim]['height'] = data.backgroundImage[dim].height;
                constructed[dim]['src'] = v.hash;
            });
            return ipfs_connector_1.IpfsConnector.getInstance().api.add(constructed);
        });
        saved = yield ipfs_connector_1.IpfsConnector.getInstance().api.addLink({
            name: 'backgroundImage',
            size: tmp.size,
            hash: tmp.hash
        }, targetHash);
        targetHash = saved.multihash;
    }
    saved = null;
    tmp = null;
    keys = null;
    pool = null;
    return targetHash;
});
exports.getShortProfile = Promise.coroutine(function* (hash, resolveAvatar = false) {
    if (records_1.profiles.getShort(hash)) {
        return Promise.resolve(records_1.profiles.getShort(hash));
    }
    const avatarPath = { [exports.ProfileSchema.AVATAR]: '' };
    const profileBase = yield ipfs_connector_1.IpfsConnector.getInstance().api.get(hash);
    const avatar = yield ipfs_connector_1.IpfsConnector.getInstance().api.findLinks(hash, [exports.ProfileSchema.AVATAR]);
    if (avatar.length) {
        if (!resolveAvatar) {
            avatarPath[exports.ProfileSchema.AVATAR] = avatar[0].multihash;
        }
        else {
            avatarPath[exports.ProfileSchema.AVATAR] = yield ipfs_connector_1.IpfsConnector.getInstance().api.getFile(avatar[0].multihash);
        }
    }
    const fetched = Object.assign({}, profileBase, avatarPath);
    records_1.profiles.setShort(hash, fetched);
    return fetched;
});
exports.resolveProfile = Promise.coroutine(function* (hash, resolveImages = false) {
    if (records_1.profiles.getFull(hash)) {
        return Promise.resolve(records_1.profiles.getFull(hash));
    }
    let constructed = {
        [exports.ProfileSchema.LINKS]: [],
        [exports.ProfileSchema.ABOUT]: '',
        [exports.ProfileSchema.BACKGROUND_IMAGE]: ''
    };
    const shortProfile = yield exports.getShortProfile(hash, resolveImages);
    const pool = yield ipfs_connector_1.IpfsConnector.getInstance()
        .api.findLinks(hash, [exports.ProfileSchema.LINKS, exports.ProfileSchema.ABOUT, exports.ProfileSchema.BACKGROUND_IMAGE]);
    for (let i = 0; i < pool.length; i++) {
        constructed[pool[i].name] = yield ipfs_connector_1.IpfsConnector.getInstance().api.get(pool[i].multihash);
    }
    const returned = Object.assign({}, shortProfile, constructed);
    records_1.profiles.setFull(hash, returned);
    return returned;
});
//# sourceMappingURL=ipfs.js.map