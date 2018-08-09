"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blPromise = require("bluebird");
const uts46 = require("idna-uts46");
const ethereumjs_util_1 = require("ethereumjs-util");
const constants_1 = require("./constants");
const ramda_1 = require("ramda");
function init(sp, getService) {
    const contracts = getService(constants_1.CORE_MODULE.CONTRACTS);
    const web3Api = getService(constants_1.CORE_MODULE.WEB3_API);
    const ipfsConnector = getService(constants_1.CORE_MODULE.IPFS_CONNECTOR);
    const normaliseId = function (name) {
        return uts46.toAscii(name, { useStd3ASCII: true, transitional: false });
    };
    const profileAddress = blPromise.coroutine(function* (data) {
        let profileAddress;
        if (data.akashaId) {
            const nameHash = yield contracts
                .instance.ProfileRegistrar
                .hash(normaliseId(data.akashaId));
            profileAddress = yield contracts.instance.ProfileResolver.addr(nameHash);
        }
        else if (data.ethAddress) {
            profileAddress = data.ethAddress;
        }
        if (profileAddress && !!ethereumjs_util_1.unpad(profileAddress)) {
            return blPromise.resolve(profileAddress);
        }
        return blPromise.resolve(null);
    });
    const resolveEthAddress = blPromise.coroutine(function* (ethAddress) {
        const nameHash = yield contracts.instance.ProfileResolver.reverse(ethAddress);
        if (!!ethereumjs_util_1.unpad(nameHash)) {
            const [akashaId, , ,] = yield contracts.instance.ProfileResolver.resolve(nameHash);
            return { akashaId: normaliseId(web3Api.instance.toUtf8(akashaId)), ethAddress };
        }
        return { ethAddress };
    });
    const ipfsCreateProfile = blPromise.coroutine(function* (data) {
        let saved;
        let tmp;
        let targetHash;
        let keys;
        let pool;
        let i = 0;
        const simpleLinks = [
            constants_1.PROFILE_CONSTANTS.AVATAR,
            constants_1.PROFILE_CONSTANTS.ABOUT,
            constants_1.PROFILE_CONSTANTS.LINKS,
        ];
        const root = yield ipfsConnector.getInstance()
            .api.add({ firstName: data.firstName, lastName: data.lastName });
        targetHash = root.hash;
        while (i < simpleLinks.length) {
            if (!ramda_1.isEmpty(data[simpleLinks[i]]) && data[simpleLinks[i]]) {
                tmp = yield ipfsConnector.getInstance()
                    .api
                    .add(data[simpleLinks[i]], simpleLinks[i] === constants_1.PROFILE_CONSTANTS.AVATAR, (simpleLinks[i] === constants_1.PROFILE_CONSTANTS.AVATAR) &&
                    ramda_1.is(String, data[simpleLinks[i]]));
                saved = yield ipfsConnector.getInstance()
                    .api
                    .addLink({ name: simpleLinks[i], size: tmp.size, hash: tmp.hash }, targetHash);
                targetHash = saved.multihash;
            }
            i++;
        }
        if (data.backgroundImage) {
            keys = Object.keys(data.backgroundImage).sort();
            pool = keys.map((media) => {
                return ipfsConnector
                    .getInstance()
                    .api
                    .add(data.backgroundImage[media].src, true, ramda_1.is(String, data.backgroundImage[media].src));
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
                return ipfsConnector.getInstance().api.add(constructed);
            });
            saved = yield ipfsConnector.getInstance().api.addLink({
                name: 'backgroundImage',
                size: tmp.size,
                hash: tmp.hash,
            }, targetHash);
            targetHash = saved.multihash;
        }
        saved = null;
        tmp = null;
        keys = null;
        pool = null;
        return targetHash;
    });
    const service = function () {
        return { normaliseId, profileAddress, resolveEthAddress, ipfsCreateProfile };
    };
    sp().service(constants_1.COMMON_MODULE.profileHelpers, service);
}
exports.default = init;
//# sourceMappingURL=profile-helpers.js.map