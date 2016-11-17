"use strict";
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const Promise = require('bluebird');
const ramda_1 = require('ramda');
const records_1 = require('../models/records');
exports.DRAFT_BLOCKS = 'blocks';
exports.ATOMIC_TYPE = 'atomic';
exports.IMAGE_TYPE = 'image';
class IpfsEntry {
    create(content, tags) {
        const ipfsApiRequests = [];
        this.draft = Object.assign({}, content.draft);
        content.draft = null;
        this.title = content.title;
        this.licence = content.licence;
        this.tags = tags;
        this.wordCount = content.wordCount;
        ipfsApiRequests.push(ipfs_connector_1.IpfsConnector.getInstance().api
            .constructObjLink(content.featuredImage, true)
            .then((obj) => this.featuredImage = obj));
        ipfsApiRequests.push(ipfs_connector_1.IpfsConnector.getInstance().api
            .constructObjLink(content.excerpt)
            .then((obj) => this.excerpt = obj));
        return Promise.all(ipfsApiRequests)
            .then(() => this._uploadMediaDraft())
            .then((draft) => {
            return ipfs_connector_1.IpfsConnector.getInstance().api
                .add({
                draft: draft,
                excerpt: this.excerpt,
                featuredImage: this.featuredImage,
                licence: this.licence,
                tags: this.tags,
                title: this.title,
                wordCount: this.wordCount
            });
        });
    }
    _filterForImages() {
        const blockIndex = [];
        const imageEntities = this.draft[exports.DRAFT_BLOCKS].filter((element, index) => {
            if (element.type !== exports.ATOMIC_TYPE || ramda_1.isEmpty(element.data.type)) {
                return false;
            }
            if (element.data.type === exports.IMAGE_TYPE) {
                blockIndex.push(index);
                return true;
            }
            return false;
        });
        return { blockIndex, imageEntities };
    }
    _uploadMediaDraft() {
        const uploads = [];
        const { imageEntities, blockIndex } = this._filterForImages();
        imageEntities.forEach((element, index) => {
            const keys = Object.keys(element.data.files).sort();
            keys.forEach((imSize) => {
                if (!Buffer.isBuffer(element.data.files[imSize].src)) {
                    return false;
                }
                uploads.push(ipfs_connector_1.IpfsConnector.getInstance().api
                    .add(element.data.files[imSize].src, true)
                    .then((obj) => {
                    this.draft[exports.DRAFT_BLOCKS][blockIndex[index]].data.files[imSize].src = obj;
                }));
            });
        });
        return Promise.all(uploads).then(() => {
            return ipfs_connector_1.IpfsConnector.getInstance().api.constructObjLink(Buffer.from(JSON.stringify(this.draft)), true);
        });
    }
}
function getShortContent(hash) {
    if (records_1.entries.getShort(hash)) {
        return Promise.resolve(records_1.entries.getShort(hash));
    }
    return ipfs_connector_1.IpfsConnector.getInstance().api
        .get(hash)
        .then((data) => {
        return ipfs_connector_1.IpfsConnector.getInstance()
            .api
            .resolve(data.excerpt[ipfs_connector_1.IpfsApiHelper.LINK_SYMBOL])
            .then((excerpt) => {
            data.excerpt = excerpt;
            data.featuredImage = data.featuredImage[ipfs_connector_1.IpfsApiHelper.LINK_SYMBOL];
            records_1.entries.setShort(hash, data);
            return data;
        });
    });
}
exports.getShortContent = getShortContent;
function getFullContent(hash) {
    if (records_1.entries.getFull(hash)) {
        return Promise.resolve(records_1.entries.getFull(hash));
    }
    return ipfs_connector_1.IpfsConnector.getInstance().api
        .get(hash)
        .then((data) => {
        return ipfs_connector_1.IpfsConnector.getInstance()
            .api
            .resolve(data.draft[ipfs_connector_1.IpfsApiHelper.LINK_SYMBOL])
            .then((draft) => {
            data.draft = draft.toString();
            records_1.entries.setFull(hash, data);
            return data;
        });
    });
}
exports.getFullContent = getFullContent;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IpfsEntry;
//# sourceMappingURL=ipfs.js.map