"use strict";
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const Promise = require('bluebird');
const create = (data) => {
    const returned = Object.assign({}, data);
    let media = [];
    console.log('inside creation');
    if (data.backgroundImage) {
        media = data.backgroundImage.map((media) => {
            return ipfs_connector_1.IpfsConnector.getInstance().api.add(Buffer.from(media.src));
        });
    }
    if (data.avatar) {
        media.push(ipfs_connector_1.IpfsConnector.getInstance()
            .api
            .add(Buffer.from(data.avatar)));
    }
    return Promise.all(media)
        .then((hashes) => {
        console.log('inside all creation');
        hashes.forEach((v, i) => {
            if (i === (hashes.length - 1)) {
                returned.avatar = v;
            }
            else {
                returned.backgroundImage[i].src = v;
            }
        });
        console.log('ipfs object', returned);
        return ipfs_connector_1.IpfsConnector.getInstance().api.add(returned);
    });
};
const getShortProfile = (hash) => {
    return ipfs_connector_1.IpfsConnector.getInstance().api.get(hash)
        .then((schema) => {
        let resolved = Object.assign({}, schema);
        if (schema.avatar) {
            return ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .resolve(schema.avatar)
                .then((data) => {
                resolved.avatar = Uint8Array.from(data);
                return resolved;
            });
        }
        return Promise.resolve(resolved);
    });
};
const resolveProfile = (hash) => {
    return getShortProfile(hash)
        .then((schema) => {
        let resolved = Object.assign({}, schema);
        const LINKS = [];
        if (schema.backgroundImage) {
            schema.backgroundImage.forEach((media) => {
                LINKS.push(ipfs_connector_1.IpfsConnector.getInstance().api.resolve(media.src));
            });
        }
        return Promise.all(LINKS)
            .then((sources) => {
            sources.forEach((val, i) => {
                resolved.backgroundImage[i].src = Uint8Array.from(val);
            });
            return resolved;
        });
    });
};
function init() {
    return {
        create: create,
        getShortProfile: getShortProfile,
        resolveProfile: resolveProfile
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = init;
//# sourceMappingURL=ipfs.js.map