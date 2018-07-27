"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const ramda_1 = require("ramda");
const safe_buffer_1 = require("safe-buffer");
const constants_1 = require("@akashaproject/common/constants");
exports.DRAFT_BLOCKS = 'blocks';
exports.ATOMIC_TYPE = 'atomic';
exports.IMAGE_TYPE = 'image';
exports.MAX_SIZE = 200 * 1000;
exports.EXCERPT = 'excerpt';
exports.FEATURED_IMAGE = 'featuredImage';
exports.CARD_INFO = 'cardInfo';
exports.DRAFT_PART = 'draft-part';
exports.PREVIOUS_VERSION = 'previous-version';
function init(sp, getService) {
    class IpfsEntry {
        create(content, tags, entryType, previous) {
            const ipfsApiRequests = [];
            this.entryLinks = [];
            this.draft = Object.assign({}, content.draft);
            content.draft = null;
            this.title = content.title;
            this.licence = content.licence;
            this.tags = tags;
            this.wordCount = content.wordCount;
            if (content.featuredImage && ramda_1.is(Object, content.featuredImage)) {
                const req = (Object.keys(content.featuredImage).sort()).map((imSize) => {
                    if (!content.featuredImage[imSize].src) {
                        return Promise.resolve({});
                    }
                    const mediaData = this._normalizeImage(content.featuredImage[imSize].src);
                    return getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api
                        .add(content.featuredImage[imSize].src, true, ramda_1.is(String, mediaData))
                        .then((obj) => {
                        return {
                            [imSize]: Object.assign({}, content.featuredImage[imSize], { src: obj.hash }),
                        };
                    });
                });
                ipfsApiRequests.push(Promise.all(req).then((sizes) => {
                    const LINK = {};
                    sizes.forEach((record) => {
                        Object.assign(LINK, record);
                    });
                    return getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api.add(LINK);
                }).then((obj) => {
                    this.entryLinks.push(Object.assign({}, obj, { name: exports.FEATURED_IMAGE }));
                }));
            }
            if (content.cardInfo && ramda_1.is(Object, content.cardInfo)) {
                ipfsApiRequests.push(getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api
                    .add(content.cardInfo)
                    .then((obj) => this.entryLinks.push(Object.assign({}, obj, { name: exports.CARD_INFO }))));
            }
            ipfsApiRequests.push(getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api
                .add(content.excerpt)
                .then((obj) => this.entryLinks.push(Object.assign({}, obj, { name: exports.EXCERPT }))));
            if (previous && previous.hash) {
                getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api
                    .getStats(previous.hash)
                    .then((stats) => {
                    this.entryLinks.push({ hash: stats.Hash, size: stats.CumulativeSize, name: exports.PREVIOUS_VERSION });
                });
            }
            return Promise.all(ipfsApiRequests)
                .then(() => this._uploadMediaDraft())
                .then((parts) => {
                return getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api
                    .createNode({
                    draftParts: parts,
                    licence: this.licence,
                    tags: this.tags,
                    title: this.title,
                    wordCount: this.wordCount,
                    entryType,
                    version: (previous && previous.hasOwnProperty('version')) ?
                        ++previous.version : 0,
                }, this.entryLinks).then((node) => node.hash);
            });
        }
        edit(content, tags, entryType, previousHash) {
            return getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api
                .get(previousHash)
                .then((data) => {
                if (content.hasOwnProperty('version')) {
                    delete content.version;
                }
                return this.create(content, tags, entryType, {
                    hash: previousHash,
                    version: (data.version) ? data.version : 0,
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
        _normalizeImage(data) {
            if (ramda_1.is(String, data) || safe_buffer_1.Buffer.isBuffer(data)) {
                return data;
            }
            return safe_buffer_1.Buffer.from(ramda_1.values(data));
        }
        _uploadMediaDraft() {
            const uploads = [];
            const { imageEntities, blockIndex } = this._filterForImages();
            imageEntities.forEach((element, index) => {
                const keys = Object.keys(element.data.files).sort();
                keys.forEach((imSize) => {
                    if (!element.data.files[imSize].src) {
                        return;
                    }
                    const mediaData = this._normalizeImage(element.data.files[imSize].src);
                    uploads.push(getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api
                        .add(mediaData, true, ramda_1.is(String, mediaData))
                        .then((obj) => {
                        this.entryLinks.push(Object.assign({}, obj, { name: (imSize + index) }));
                        this.draft[exports.DRAFT_BLOCKS][blockIndex[index]]
                            .data.files[imSize].src = obj.hash;
                    }));
                });
            });
            return Promise.all(uploads).then(() => {
                let start;
                let end;
                const slices = [];
                const entryDraft = safe_buffer_1.Buffer.from(JSON.stringify(this.draft));
                const parts = Math.ceil(entryDraft.length / exports.MAX_SIZE);
                for (let q = 0; q <= parts; q++) {
                    start = q * exports.MAX_SIZE;
                    end = start + exports.MAX_SIZE;
                    if (start > entryDraft.length) {
                        break;
                    }
                    if (end > entryDraft.length) {
                        end = entryDraft.length;
                    }
                    const sliceDraft = entryDraft.slice(start, end);
                    slices.push(getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api
                        .add(sliceDraft)
                        .then((obj) => {
                        this.entryLinks.push(Object.assign({}, obj, { name: (exports.DRAFT_PART + q) }));
                    }));
                }
                return Promise.all(slices).then(() => parts);
            });
        }
    }
    const getShortContent = Promise.coroutine(function* (hash) {
        const entries = getService(constants_1.CORE_MODULE.STASH).entries;
        if (entries.hasShort(hash)) {
            return Promise.resolve(entries.getShort(hash));
        }
        const response = {
            [exports.EXCERPT]: '',
            [exports.FEATURED_IMAGE]: '',
            [exports.CARD_INFO]: '',
        };
        const root = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api.get(hash);
        const extraData = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)
            .getInstance().api.findLinks(hash, [exports.EXCERPT, exports.FEATURED_IMAGE, exports.CARD_INFO]);
        for (let i = 0; i < extraData.length; i++) {
            response[extraData[i].name] = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)
                .getInstance().api.get(extraData[i].multihash);
        }
        if ((response[exports.CARD_INFO] && !ramda_1.is(Object, response[exports.CARD_INFO])) ||
            safe_buffer_1.Buffer.isBuffer(response[exports.CARD_INFO])) {
            response[exports.CARD_INFO] = '';
        }
        if ((response[exports.EXCERPT] && !ramda_1.is(String, response[exports.EXCERPT])) ||
            safe_buffer_1.Buffer.isBuffer(response[exports.EXCERPT])) {
            response[exports.EXCERPT] = '';
        }
        if ((response[exports.FEATURED_IMAGE] && !ramda_1.is(Object, response[exports.FEATURED_IMAGE])) ||
            safe_buffer_1.Buffer.isBuffer(response[exports.FEATURED_IMAGE])) {
            response[exports.FEATURED_IMAGE] = '';
        }
        const data = Object.assign({}, root, response);
        entries.setShort(hash, data);
        return data;
    });
    const findVersion = Promise.coroutine(function* (hash, version) {
        const root = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance().api.get(hash);
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
        const seek = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)
            .getInstance().api.findLinkPath(hash, linkPath);
        return seek[0].multihash;
    });
    const getFullContent = Promise.coroutine(function* (hash, version) {
        const indexedVersion = (ramda_1.is(Number, version)) ? `${hash}/v/${version}` : hash;
        const entries = getService(constants_1.CORE_MODULE.STASH).entries;
        if (entries.hasFull(indexedVersion)) {
            return Promise.resolve(entries.getFull(indexedVersion));
        }
        let tmp;
        let draft;
        let rootHash = hash;
        if (ramda_1.is(Number, version)) {
            rootHash = yield findVersion(hash, version);
        }
        const root = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR)
            .getInstance().api.get(rootHash);
        const parts = [];
        const draftParts = [];
        for (let i = 0; i < root.draftParts; i++) {
            parts.push(exports.DRAFT_PART + i);
        }
        const extraData = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance()
            .api.findLinks(rootHash, parts);
        for (let y = 0; y < extraData.length; y++) {
            tmp = yield getService(constants_1.CORE_MODULE.IPFS_CONNECTOR).getInstance()
                .api.getObject(extraData[y].multihash, true);
            draftParts.push(tmp);
        }
        const draftObj = draftParts.map((el) => {
            let currentData = (el.toJSON()).data;
            if (!safe_buffer_1.Buffer.isBuffer(currentData)) {
                currentData = safe_buffer_1.Buffer.from(currentData);
            }
            return currentData;
        });
        const content = (safe_buffer_1.Buffer.concat(draftObj)).toString();
        try {
            draft = JSON.parse(content);
        }
        catch (err) {
            draft = null;
        }
        const shortContent = yield getShortContent(rootHash);
        const data = Object.assign({}, root, shortContent, { draft });
        entries.setFull(indexedVersion, data);
        tmp = null;
        draft = null;
        return data;
    });
    const services = { IpfsEntry, getShortContent, getFullContent, findVersion };
    const service = function () {
        return services;
    };
    sp().service(constants_1.ENTRY_MODULE.ipfs, service);
}
exports.default = init;
//# sourceMappingURL=ipfs.js.map