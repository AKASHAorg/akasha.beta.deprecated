import * as Promise from 'bluebird';
import { is, isEmpty, values } from 'ramda';
import { Buffer } from 'safe-buffer';
import { CORE_MODULE, ENTRY_MODULE } from '@akashaproject/common/constants';

export const DRAFT_BLOCKS = 'blocks';
export const ATOMIC_TYPE = 'atomic';
export const IMAGE_TYPE = 'image';
export const MAX_SIZE = 200 * 1000;
export const EXCERPT = 'excerpt';
export const FEATURED_IMAGE = 'featuredImage';
export const CARD_INFO = 'cardInfo';
export const DRAFT_PART = 'draft-part';
export const PREVIOUS_VERSION = 'previous-version';

export default function init (sp, getService) {

  class IpfsEntry {

    id: string;
    draft: any;
    title: string;
    licence: string;
    tags: any[];
    wordCount: number;
    entryLinks: any[];

    create (content: any, tags: any[], entryType: number,
            previous?: { hash: string, version: number }) {

      const ipfsApiRequests = [];
      this.entryLinks = [];
      this.draft = Object.assign({}, content.draft);
      content.draft = null;
      this.title = content.title;
      this.licence = content.licence;
      this.tags = tags;
      this.wordCount = content.wordCount;
      if (content.featuredImage && is(Object, content.featuredImage)) {
        const req = (Object.keys(content.featuredImage).sort()).map((imSize) => {
          if (!content.featuredImage[imSize].src) {
            return Promise.resolve({});
          }
          const mediaData = this._normalizeImage(content.featuredImage[imSize].src);
          return (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
            .add(content.featuredImage[imSize].src, true, is(String, mediaData))
            .then((obj) => {
              return {
                [imSize]: Object.assign(
                  {},
                  content.featuredImage[imSize],
                  { src: obj.hash },
                ),
              };
            });
        });
        ipfsApiRequests.push(
          Promise.all(req).then((sizes) => {
            const LINK = {};
            sizes.forEach((record) => {
              Object.assign(LINK, record);
            });
            return (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api.add(LINK);
          }).then((obj) => {
            this.entryLinks.push(Object.assign({}, obj, { name: FEATURED_IMAGE }));
          }),
        );
      }
      if (content.cardInfo && is(Object, content.cardInfo)) {
        ipfsApiRequests.push(
          getService(CORE_MODULE.IPFS_CONNECTOR).getInstance().api
            .add(content.cardInfo)
            .then((obj) => this.entryLinks.push(
              Object.assign({}, obj, { name: CARD_INFO }))));
      }

      ipfsApiRequests.push(
        (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
          .add(content.excerpt)
          .then((obj) => this.entryLinks.push(Object.assign({}, obj, { name: EXCERPT }))));

      if (previous && previous.hash) {
        (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
          .getStats(previous.hash)
          .then((stats) => {
            this.entryLinks.push(
              { hash: stats.Hash, size: stats.CumulativeSize, name: PREVIOUS_VERSION });
          });
      }

      return Promise.all(ipfsApiRequests)
        .then(() => this._uploadMediaDraft())
        .then((parts) => {
          return (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
            .createNode(
              {
                draftParts: parts,
                licence: this.licence,
                tags: this.tags,
                title: this.title,
                wordCount: this.wordCount,
                entryType,
                version:
                  (previous && previous.hasOwnProperty('version')) ?
                    ++previous.version : 0,
              },
              this.entryLinks).then((node) => node.hash);
        });
    }

    edit (content: any, tags: any[], entryType: number, previousHash) {
      return (getService(CORE_MODULE.IPFS_CONNECTOR)).getInstance().api
        .get(previousHash)
        .then((data) => {
          if (content.hasOwnProperty('version')) {
            delete content.version;
          }

          return this.create(
            content,
            tags,
            entryType,
            {
              hash: previousHash,
              version: (data.version) ? data.version : 0,
            },
          );
        });
    }

    private _filterForImages () {
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

    private _normalizeImage (data) {
      if (is(String, data) || Buffer.isBuffer(data)) {
        return data;
      }
      return Buffer.from(values(data));
    }

    private _uploadMediaDraft () {
      /**
       * filter draft object for images and upload them to ipfs
       */
      const uploads = [];
      const { imageEntities, blockIndex } = this._filterForImages();

      imageEntities.forEach((element, index) => {
        const keys = Object.keys(element.data.files).sort();
        keys.forEach((imSize) => {
          if (!element.data.files[imSize].src) {
            return;
          }
          const mediaData = this._normalizeImage(element.data.files[imSize].src);
          uploads.push(
            getService(CORE_MODULE.IPFS_CONNECTOR).getInstance().api
              .add(mediaData, true, is(String, mediaData))
              .then(
                (obj) => {
                  this.entryLinks.push(
                    Object.assign({}, obj, { name: (imSize + index) }));

                  this.draft[DRAFT_BLOCKS][blockIndex[index]]
                    .data.files[imSize].src = obj.hash;
                },
              ),
          );
        });
      });
      return Promise.all(uploads).then(() => {
        let start;
        let end;
        const slices = [];
        const entryDraft = Buffer.from(JSON.stringify(this.draft));
        const parts = Math.ceil(entryDraft.length / MAX_SIZE);
        for (let q = 0; q <= parts; q++) {
          start = q * MAX_SIZE;
          end = start + MAX_SIZE;

          if (start > entryDraft.length) {
            break;
          }

          if (end > entryDraft.length) {
            end = entryDraft.length;
          }
          const sliceDraft = entryDraft.slice(start, end);
          slices.push(
            getService(CORE_MODULE.IPFS_CONNECTOR).getInstance().api
              .add(sliceDraft)
              .then(
                (obj) => {
                  this.entryLinks.push(
                    Object.assign({}, obj, { name: (DRAFT_PART + q) }),
                  );
                },
              ),
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
  const getShortContent = Promise.coroutine(function* (hash) {
    const entries = getService(CORE_MODULE.STASH).entries;
    if (entries.hasShort(hash)) {
      return Promise.resolve(entries.getShort(hash));
    }
    const response: any = {
      [EXCERPT]: '',
      [FEATURED_IMAGE]: '',
      [CARD_INFO]: '',
    };
    const root = yield getService(CORE_MODULE.IPFS_CONNECTOR).getInstance().api.get(hash);

    const extraData = yield getService(CORE_MODULE.IPFS_CONNECTOR)
      .getInstance().api.findLinks(hash, [EXCERPT, FEATURED_IMAGE, CARD_INFO]);
    for (let i = 0; i < extraData.length; i++) {
      response[extraData[i].name] = yield getService(CORE_MODULE.IPFS_CONNECTOR)
        .getInstance().api.get(extraData[i].multihash);
    }

    if ((response[CARD_INFO] && !is(Object, response[CARD_INFO])) ||
      Buffer.isBuffer(response[CARD_INFO])) {
      response[CARD_INFO] = '';
    }

    if ((response[EXCERPT] && !is(String, response[EXCERPT])) ||
      Buffer.isBuffer(response[EXCERPT])) {
      response[EXCERPT] = '';
    }

    if ((response[FEATURED_IMAGE] && !is(Object, response[FEATURED_IMAGE])) ||
      Buffer.isBuffer(response[FEATURED_IMAGE])) {
      response[FEATURED_IMAGE] = '';
    }

    const data = Object.assign({}, root, response);
    entries.setShort(hash, data);
    return data;
  });

  /**
   *
   * @type {Function}
   */
  const findVersion = Promise.coroutine(
    function* (hash: string, version: number) {
      const root = yield getService(CORE_MODULE.IPFS_CONNECTOR).getInstance().api.get(hash);
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
        linkPath.push(PREVIOUS_VERSION);
      }
      const seek = yield getService(CORE_MODULE.IPFS_CONNECTOR)
        .getInstance().api.findLinkPath(hash, linkPath);

      return seek[0].multihash;
    });

  /**
   *
   * @param hash
   * @returns {any}
   */
  const getFullContent = Promise.coroutine(
    function* (hash: string, version: any) {
      const indexedVersion = (is(Number, version)) ? `${hash}/v/${version}` : hash;
      const entries = getService(CORE_MODULE.STASH).entries;
      if (entries.hasFull(indexedVersion)) {
        return Promise.resolve(entries.getFull(indexedVersion));
      }
      let tmp;
      let draft;
      let rootHash = hash;
      if (is(Number, version)) {
        rootHash = yield findVersion(hash, version);
      }

      const root = yield getService(CORE_MODULE.IPFS_CONNECTOR)
        .getInstance().api.get(rootHash);

      const parts = [];
      const draftParts = [];
      for (let i = 0; i < root.draftParts; i++) {
        parts.push(DRAFT_PART + i);
      }
      const extraData = yield getService(CORE_MODULE.IPFS_CONNECTOR).getInstance()
        .api.findLinks(rootHash, parts);
      for (let y = 0; y < extraData.length; y++) {
        tmp = yield getService(CORE_MODULE.IPFS_CONNECTOR).getInstance()
          .api.getObject(extraData[y].multihash, true);
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
  sp().service(ENTRY_MODULE.ipfs, service);
}
