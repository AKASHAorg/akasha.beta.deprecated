"use strict";
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const records_1 = require('../models/records');
const Promise = require('bluebird');
exports.create = (data) => {
    const returned = {
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: '',
        backgroundImage: '',
        about: '',
        links: ''
    };
    let media = [];
    let keys;
    if (data.backgroundImage) {
        keys = Object.keys(data.backgroundImage).sort();
        media = keys.map((media) => {
            return ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .constructObjLink(data.backgroundImage[media].src, true);
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
            delete data.backgroundImage;
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
                .constructObjLink(data.avatar, true);
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
                .constructObjLink(transformed);
        }
        return Promise.resolve('');
    }).then((hash) => {
        if (hash) {
            returned.about = hash;
        }
        if (data.links) {
            return ipfs_connector_1.IpfsConnector.getInstance().api.constructObjLink(data.links);
        }
        return Promise.resolve('');
    }).then((hash) => {
        if (hash) {
            returned.links = hash;
        }
        return ipfs_connector_1.IpfsConnector.getInstance().api.add(returned);
    });
};
exports.getShortProfile = (hash, resolveAvatar = false) => {
    if (records_1.profiles.getShort(hash)) {
        return Promise.resolve(records_1.profiles.getShort(hash));
    }
    return ipfs_connector_1.IpfsConnector.getInstance().api.get(hash)
        .then((schema) => {
        let resolved = Object.assign({}, schema);
        if (schema.avatar) {
            if (resolveAvatar) {
                return ipfs_connector_1.IpfsConnector.getInstance()
                    .api
                    .resolve(`${hash}/avatar`)
                    .then((data) => {
                    resolved.avatar = data;
                    records_1.profiles.setShort(hash, resolved);
                    return resolved;
                });
            }
            resolved.avatar = schema.avatar[ipfs_connector_1.IpfsApiHelper.LINK_SYMBOL];
        }
        records_1.profiles.setShort(hash, resolved);
        return resolved;
    });
};
exports.resolveProfile = (hash, resolveImages = false) => {
    let resolved;
    let keys;
    if (records_1.profiles.getFull(hash)) {
        return Promise.resolve(records_1.profiles.getFull(hash));
    }
    return exports.getShortProfile(hash, resolveImages)
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
            if (resolveImages) {
                media = keys.map((media) => {
                    return ipfs_connector_1.IpfsConnector.getInstance()
                        .api
                        .resolve(resolved.backgroundImage[media].src);
                });
                return Promise.all(media);
            }
        }
        return Promise.resolve('');
    }).then((images) => {
        if (images.length) {
            images.forEach((v, i) => {
                resolved.backgroundImage[keys[i]].src = v;
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
        if (resolved.links) {
            return ipfs_connector_1.IpfsConnector.getInstance()
                .api
                .resolve(resolved.links);
        }
        return Promise.resolve('');
    }).then((links) => {
        if (links) {
            resolved.links = links;
        }
        records_1.profiles.setFull(hash, resolved);
        return resolved;
    });
};
//# sourceMappingURL=ipfs.js.map