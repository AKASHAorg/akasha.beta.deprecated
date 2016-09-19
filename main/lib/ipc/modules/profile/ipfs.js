"use strict";
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const Promise = require('bluebird');
const create = (data) => {
    const returned = {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: '',
        backgroundImage: '',
        about: '',
        links: data.links
    };
    let media = [];
    let keys;
    if (data.backgroundImage) {
        keys = Object.keys(data.backgroundImage).sort();
        media = keys.map((media) => {
            return ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .addFile(Buffer.from(data.backgroundImage[media].src));
        });
    }
    return Promise.all(media)
        .then((hashes) => {
        let constructed = {};
        if (hashes.length) {
            hashes.forEach((v, i) => {
                const dim = keys[i];
                constructed[dim] = {};
                constructed[dim]['width'] = data.backgroundImage[dim].width;
                constructed[dim]['height'] = data.backgroundImage[dim].height;
                constructed[dim]['src'] = v;
            });
            return ipfs_connector_1.IpfsConnector.getInstance().api.add(constructed).then((hash) => {
                return ipfs_connector_1.IpfsConnector.getInstance().api.constructObjLink(hash);
            });
        }
        return Promise.resolve('');
    }).then((hash) => {
        if (hash) {
            returned.backgroundImage = hash;
        }
        if (data.avatar) {
            return ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .addFile(Buffer.from(data.avatar));
        }
        return Promise.resolve('');
    }).then((hash) => {
        if (hash) {
            returned.avatar = hash;
        }
        if (data.about) {
            const transformed = Buffer.from(data.about);
            return ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .add(transformed);
        }
        return Promise.resolve('');
    }).then((hash) => {
        if (hash) {
            returned.about = hash;
        }
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
    let resolved;
    let keys;
    return getShortProfile(hash)
        .then((schema) => {
        resolved = Object.assign({}, schema);
        const LINKS = [];
        if (schema.backgroundImage) {
            return ipfs_connector_1.IpfsConnector.getInstance().api.resolve(schema.backgroundImage);
        }
        return Promise.resolve('');
    }).then((mediaObj) => {
        let media;
        if (mediaObj) {
            keys = Object.keys(mediaObj).sort();
            resolved.backgroundImage = mediaObj;
            media = keys.map((media) => {
                return ipfs_connector_1.IpfsConnector.getInstance()
                    .api
                    .resolve(resolved.backgroundImage[media].src);
            });
            return Promise.all(media);
        }
        return Promise.resolve('');
    }).then((images) => {
        if (images.length) {
            images.forEach((v, i) => {
                resolved.backgroundImage[keys[i]].src = Uint8Array.from(v);
            });
        }
        if (resolved.about) {
            return ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .resolve(resolved.about);
        }
        return Promise.resolve('');
    }).then((about) => {
        if (about) {
            resolved.about = Buffer.from(about).toString('utf8');
        }
        return resolved;
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