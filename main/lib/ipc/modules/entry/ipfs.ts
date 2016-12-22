import { IpfsConnector } from '@akashaproject/ipfs-connector';
import * as Promise from 'bluebird';
import { isEmpty } from 'ramda';
import { entries } from '../models/records';

export const DRAFT_BLOCKS = 'blocks';
export const ATOMIC_TYPE = 'atomic';
export const IMAGE_TYPE = 'image';
export const max_size = 200 * 1000;
export const EXCERPT = 'excerpt';
export const FEATURED_IMAGE = 'featuredImage';
export const DRAFT_PART = 'draft-part';

class IpfsEntry {

    id: string;
    draft: any;
    title: string;
    licence: string;
    tags: any[];
    wordCount: number;
    entryLinks: any[];

    /**
     *
     * @param content
     * @param tags
     * @returns {any}
     */
    create(content: any, tags: any[]) {
        const ipfsApiRequests = [];
        this.entryLinks = [];
        this.draft = Object.assign({}, content.draft);
        content.draft = null;
        this.title = content.title;
        this.licence = content.licence;
        this.tags = tags;
        this.wordCount = content.wordCount;
        if (content.featuredImage) {
            ipfsApiRequests.push(
                IpfsConnector.getInstance().api
                    .add(content.featuredImage, true)
                    .then((obj) => {
                        this.entryLinks.push(Object.assign({}, obj, { name: FEATURED_IMAGE }));
                    }));
        }

        ipfsApiRequests.push(
            IpfsConnector.getInstance().api
                .add(content.excerpt)
                .then((obj) => this.entryLinks.push(Object.assign({}, obj, { name: EXCERPT }))));

        return Promise.all(ipfsApiRequests)
            .then(() => this._uploadMediaDraft())
            .then((parts) => {
                return IpfsConnector.getInstance().api
                    .createNode({
                        draftParts: parts,
                        licence: this.licence,
                        tags: this.tags,
                        title: this.title,
                        wordCount: this.wordCount
                    }, this.entryLinks).then((node) => node.hash)
            });
    }

    private _filterForImages() {
        const blockIndex = [];
        const imageEntities = this.draft[DRAFT_BLOCKS].filter((element, index) => {
            if (element.type !== ATOMIC_TYPE || isEmpty(element.data.type)) {
                return false;
            }
            if (element.data.type === IMAGE_TYPE) {
                blockIndex.push(index);
                return true;
            }
            return false;
        });

        return { blockIndex, imageEntities };
    }

    private _uploadMediaDraft() {
        /**
         * filter draft object for images and upload them to ipfs
         */
        const uploads = [];
        const { imageEntities, blockIndex } = this._filterForImages();

        imageEntities.forEach((element, index) => {
            const keys = Object.keys(element.data.files).sort();
            keys.forEach((imSize) => {
                if (!Buffer.isBuffer(element.data.files[imSize].src)) {
                    return false;
                }
                uploads.push(
                    IpfsConnector.getInstance().api
                        .add(element.data.files[imSize].src, true)
                        .then(
                            (obj) => {
                                this.entryLinks.push(Object.assign({}, obj, { name: (imSize + index) }));
                                this.draft[DRAFT_BLOCKS][blockIndex[index]].data.files[imSize].src = obj.hash;
                            }
                        )
                );
            });
        });
        return Promise.all(uploads).then(() => {
            let start, end;
            const slices = [];
            const entryDraft = Buffer.from(JSON.stringify(this.draft));
            const parts = Math.ceil(entryDraft.length / max_size);
            for (let q = 0; q <= parts; q++) {
                start = q * max_size;
                end = start + max_size;

                if (start > entryDraft.length) {
                    break;
                }

                if (end > entryDraft.length) {
                    end = entryDraft.length;
                }
                let sliceDraft = entryDraft.slice(start, end);
                slices.push(
                    IpfsConnector.getInstance().api
                        .add(sliceDraft)
                        .then(
                            (obj) => {
                                this.entryLinks.push(Object.assign({}, obj, { name: (DRAFT_PART + q) }));
                            }
                        )
                );
            }
            return Promise.all(slices).then(() => parts);
        });
    }
}
/**
 *
 * @param hash
 * @returns {any}
 */
export const getShortContent = Promise.coroutine(function*(hash) {
    if (entries.getShort(hash)) {
        return Promise.resolve(entries.getShort(hash));
    }
    const response = {
        [EXCERPT]: '',
        [FEATURED_IMAGE]: ''
    };
    const root = yield IpfsConnector.getInstance().api.get(hash);
    const extraData = yield IpfsConnector.getInstance().api.findLinks(hash, [EXCERPT, FEATURED_IMAGE]);
    for (let i = 0; i < extraData.length; i++) {
        if (extraData[i].name === FEATURED_IMAGE) {
            response[FEATURED_IMAGE] = extraData[i].multihash;
        }
        if (extraData[i].name === EXCERPT) {
            response[EXCERPT] = yield IpfsConnector.getInstance().api.get(extraData[i].multihash);
        }
    }
    const data = Object.assign({}, root, response);
    entries.setShort(hash, data);
    return data;
});


/**
 *
 * @param hash
 * @returns {any}
 */
export const getFullContent = Promise.coroutine(function*(hash) {
    if (entries.getFull(hash)) {
        return Promise.resolve(entries.getFull(hash));
    }
    let tmp;
    let draft;
    const root = yield IpfsConnector.getInstance().api.get(hash);
    const parts = [];
    const draftParts = [];
    for (let i = 0; i < root.draftParts; i++) {
        parts.push(DRAFT_PART + i);
    }
    const extraData = yield IpfsConnector.getInstance().api.findLinks(hash, parts);
    for (let y = 0; y < extraData.length; y++) {
        tmp = yield IpfsConnector.getInstance().api.getObject(extraData[y].multihash, true);
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
    } catch (err) {
        draft = null;
    }
    const data = Object.assign({}, root, { draft: draft });
    entries.setFull(hash, data);
    tmp = null;
    draft = null;
    return data;
});

export default IpfsEntry;


