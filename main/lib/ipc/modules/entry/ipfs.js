"use strict";
const ipfs_connector_1 = require("@akashaproject/ipfs-connector");
const Promise = require("bluebird");
const ramda_1 = require("ramda");
const records_1 = require("../models/records");
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
                if (!element.data.files[imSize].src) {
                    return false;
                }
                const mediaData = Buffer.isBuffer(element.data.files[imSize].src) ?
                    element.data.files[imSize].src
                    :
                        Buffer.from(ramda_1.values(element.data.files[imSize].src));
                uploads.push(ipfs_connector_1.IpfsConnector.getInstance().api
                    .add(mediaData, true)
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
    if (records_1.entries.hasShort(hash)) {
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
const findVersion = Promise.coroutine(function* (hash, version) {
    const root = yield ipfs_connector_1.IpfsConnector.getInstance().api.get(hash);
    if (!root.hasOwnProperty('version')) {
        throw new Error('Cannot find version ' + version);
    }
    if (root.version === version) {
        return hash;
    }
    const depth = root.version - version;
    if (depth < 0) {
        throw new Error('This version doesn\'t exist ' + version);
    }
    const linkPath = [];
    for (let i = 0; i < depth; i++) {
        linkPath.push(exports.PREVIOUS_VERSION);
    }
    const seek = yield ipfs_connector_1.IpfsConnector.getInstance().api.findLinkPath(hash, linkPath);
    return seek[0].multihash;
});
exports.getFullContent = Promise.coroutine(function* (hash, version) {
    const indexedVersion = (ramda_1.is(Number, version)) ? `${hash}/v/${version}` : hash;
    if (records_1.entries.hasFull(indexedVersion)) {
        return Promise.resolve(records_1.entries.getFull(indexedVersion));
    }
    let tmp;
    let draft;
    let rootHash = hash;
    if (ramda_1.is(Number, version)) {
        rootHash = yield findVersion(hash, version);
    }
    const root = yield ipfs_connector_1.IpfsConnector.getInstance().api.get(rootHash);
    const parts = [];
    const draftParts = [];
    for (let i = 0; i < root.draftParts; i++) {
        parts.push(exports.DRAFT_PART + i);
    }
    const extraData = yield ipfs_connector_1.IpfsConnector.getInstance().api.findLinks(rootHash, parts);
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
    const shortContent = yield exports.getShortContent(rootHash);
    const data = Object.assign({}, root, shortContent, { draft: draft });
    records_1.entries.setFull(indexedVersion, data);
    tmp = null;
    draft = null;
    return data;
});
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = IpfsEntry;
//# sourceMappingURL=ipfs.js.map