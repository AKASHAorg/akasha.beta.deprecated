"use strict";
const ipfs_connector_1 = require('@akashaproject/ipfs-connector');
const Promise = require('bluebird');
const ramda_1 = require('ramda');
const records_1 = require('../models/records');
exports.DRAFT_BLOCKS = 'blocks';
exports.ATOMIC_TYPE = 'atomic';
exports.IMAGE_TYPE = 'image';
exports.max_size = 200 * 1000;
exports.EXCERPT = 'excerpt';
exports.FEATURED_IMAGE = 'featuredImage';
exports.DRAFT_PART = 'draft-part';
exports.PREVIOUS_VERSION = 'previous-version';
class IpfsEntry {
    create(content, tags, previous) {
        const ipfsApiRequests = [];
        this.entryLinks = [];
        this.draft = Object.assign({}, content.draft);
        content.draft = null;
        this.title = content.title;
        this.licence = content.licence;
        this.tags = tags;
        this.wordCount = content.wordCount;
        if (content.featuredImage) {
            ipfsApiRequests.push(ipfs_connector_1.IpfsConnector.getInstance().api
                .add(content.featuredImage, true)
                .then((obj) => {
                this.entryLinks.push(Object.assign({}, obj, { name: exports.FEATURED_IMAGE }));
            }));
        }
        ipfsApiRequests.push(ipfs_connector_1.IpfsConnector.getInstance().api
            .add(content.excerpt)
            .then((obj) => this.entryLinks.push(Object.assign({}, obj, { name: exports.EXCERPT }))));
        if (previous && previous.hash) {
            ipfs_connector_1.IpfsConnector.getInstance().api
                .getStats(previous.hash)
                .then((stats) => {
                this.entryLinks.push({ hash: stats.Hash, size: stats.CumulativeSize, name: exports.PREVIOUS_VERSION });
            });
        }
        return Promise.all(ipfsApiRequests)
            .then(() => this._uploadMediaDraft())
            .then((parts) => {
            return ipfs_connector_1.IpfsConnector.getInstance().api
                .createNode({
                draftParts: parts,
                licence: this.licence,
                tags: this.tags,
                title: this.title,
                wordCount: this.wordCount,
                version: (previous && previous.hasOwnProperty('version')) ? ++previous.version : 0
            }, this.entryLinks).then((node) => node.hash);
        });
    }
    edit(content, tags, previousHash) {
        return ipfs_connector_1.IpfsConnector.getInstance().api
            .get(previousHash)
            .then((data) => {
            if (content.hasOwnProperty('version')) {
                delete content.version;
            }
            return this.create(content, tags, {
                hash: previousHash,
                version: (data.version) ? data.version : 0
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
                    this.entryLinks.push(Object.assign({}, obj, { name: (imSize + index) }));
                    this.draft[exports.DRAFT_BLOCKS][blockIndex[index]].data.files[imSize].src = obj.hash;
                }));
            });
        });
        return Promise.all(uploads).then(() => {
            let start, end;
            const slices = [];
            const entryDraft = Buffer.from(JSON.stringify(this.draft));
            const parts = Math.ceil(entryDraft.length / exports.max_size);
            for (let q = 0; q <= parts; q++) {
                start = q * exports.max_size;
                end = start + exports.max_size;
                if (start > entryDraft.length) {
                    break;
                }
                if (end > entryDraft.length) {
                    end = entryDraft.length;
                }
                let sliceDraft = entryDraft.slice(start, end);
                slices.push(ipfs_connector_1.IpfsConnector.getInstance().api
                    .add(sliceDraft)
                    .then((obj) => {
                    this.entryLinks.push(Object.assign({}, obj, { name: (exports.DRAFT_PART + q) }));
                }));
            }
            return Promise.all(slices).then(() => parts);
        });
    }
}
exports.getShortContent = Promise.coroutine(function* (hash) {
    if (records_1.entries.getShort(hash)) {
        return Promise.resolve(records_1.entries.getShort(hash));
    }
    const response = {
        [exports.EXCERPT]: '',
        [exports.FEATURED_IMAGE]: ''
    };
    const root = yield ipfs_connector_1.IpfsConnector.getInstance().api.get(hash);
    const extraData = yield ipfs_connector_1.IpfsConnector.getInstance().api.findLinks(hash, [exports.EXCERPT, exports.FEATURED_IMAGE]);
    for (let i = 0; i < extraData.length; i++) {
        if (extraData[i].name === exports.FEATURED_IMAGE) {
            response[exports.FEATURED_IMAGE] = extraData[i].multihash;
        }
        if (extraData[i].name === exports.EXCERPT) {
            response[exports.EXCERPT] = yield ipfs_connector_1.IpfsConnector.getInstance().api.get(extraData[i].multihash);
        }
    }
    const data = Object.assign({}, root, response);
    records_1.entries.setShort(hash, data);
    return data;
});
exports.getFullContent = Promise.coroutine(function* (hash) {
    if (records_1.entries.getFull(hash)) {
        return Promise.resolve(records_1.entries.getFull(hash));
    }
    let tmp;
    let draft;
    const root = yield ipfs_connector_1.IpfsConnector.getInstance().api.get(hash);
    const parts = [];
    const draftParts = [];
    for (let i = 0; i < root.draftParts; i++) {
        parts.push(exports.DRAFT_PART + i);
    }
    const extraData = yield ipfs_connector_1.IpfsConnector.getInstance().api.findLinks(hash, parts);
    for (let y = 0; y < extraData.length; y++) {
        tmp = yield ipfs_connector_1.IpfsConnector.getInstance().api.getObject(extraData[y].multihash, true);
        draftParts.push(tmp);
    }
    const draftObj = draftParts.map((el) => {
        let currentData = (el.toJSON()).data;
        if (!Buffer.isBuffer(currentData)) {
            currentData = Buffer.from(currentData);
        }
        return currentData;
    });
    const content = (Buffer.concat(draftObj)).toString();
    try {
        draft = JSON.parse(content);
    }
    catch (err) {
        draft = null;
    }
    const data = Object.assign({}, root, { draft: draft });
    records_1.entries.setFull(hash, data);
    tmp = null;
    draft = null;
    return data;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IpfsEntry;
//# sourceMappingURL=ipfs.js.map