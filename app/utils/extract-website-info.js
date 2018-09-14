// @flow
import ParserUtils from './parsers/parser-utils';
import { metaTagsPriority, supportedDocs } from './parsers/parser-config';
import { isInternalLink } from './url-utils';
// <meta
//    property="meta.attributes.property.textContent"
//    content="meta.attributes.content.textContent"
// />


type ParserParams = {
    url: string,
    uploadImageToIpfs: ?boolean,
};

type AkashaParserResponse = {
    tags?: Array<Object>,
    status_code: number,
    title: string,
    description: string,
    body_description: string,
    body_image?: string
};

/**
 * @class WebsiteParser
 * @description Url parser class, used to extract info from a website`s html content
 *
 * @param {string} url website`s url
 * @param {Boolean} [uploadImageToIpfs] specifies if any image found on website should be uploaded to ipfs.
 *
 * @tutorial
 *   const websiteParser = new WebsiteParser('www.akasha.world')
 *   websiteParser.getInfo().then(info: Object);
 */
class WebsiteParser extends ParserUtils<ParserParams> {
    url: string;
    parsedUrl: Object;
    uploadImageToIpfs: Object;
    constructor (params: Object) {
        super();
        this.url = this.formatUrl(params.url);
        this.parsedUrl = ParserUtils.parseUrl(this.url);
        this.uploadImageToIpfs = params.uploadImageToIpfs;
    }

    requestWebsiteInfo = (url: string): Promise<AkashaParserResponse> =>
        this.makeParserRequest(url).then((response) => {
            const { status_code } = response;
            if (status_code !== 200) {
                const error = new Error('Request failed! Cannot generate card!');
                return Promise.reject(error);
            }
            return response;
        });
    /**
     * filter data based on config Object => metaTagsPriority
     */
    filterData = (websiteData: AkashaParserResponse) => {
        let { title, description, body_description, body_image, tags } = websiteData;
        if (!tags) tags = [];
        const descr = tags.reduce((descriptionObject, tagObj) => {
            if(tagObj.property) {
                descriptionObject[tagObj.property] = tagObj.content;
            } else if (tagObj.name) {
                descriptionObject[tagObj.name] = tagObj.content;
            }
            return descriptionObject;
        }, {title, description, body_description, body_image});
        let outputDescr = {};
        let currPriorities = {};
        metaTagsPriority.forEach(tagConf => {
            if ((!outputDescr[tagConf.key] || !outputDescr[tagConf.key].length) && descr[tagConf.name]) {
                outputDescr[tagConf.key] = descr[tagConf.name];
                if (tagConf.priority) {
                    currPriorities[tagConf.key] = tagConf.priority;
                }
            } else if (
                currPriorities[tagConf.key] &&
                descr[tagConf.name] &&
                tagConf.priority &&
                tagConf.priority < currPriorities[tagConf.key]
            ) {
                outputDescr[tagConf.key] = descr[tagConf.name];
                currPriorities[tagConf.key] = tagConf.priority;
            }
        });
        if(outputDescr.image) {
            return this.resizeImage(this.getAbsoluteUrl(outputDescr.image, this.parsedUrl), {
                ipfsFile: true
            }).then(image => ({
                ...outputDescr,
                image
            })).catch(() => ({
                ...outputDescr,
                image: {}
            }));
        }
        return Promise.resolve(outputDescr);
    }

    requestAkashaEntry = (entryId: string): Promise<Object> =>
        new Promise((resolve, reject) => {
            const ch: Object = window.Channel;
            ch.client.entry.getEntry.once((ev, resp) => {
                if(resp.error) {
                    reject('some error occured when fetching entry');
                }
                return resolve(resp.data);
            });
            ch.server.entry.getEntry.send({ entryId });
        });

    getEntryIdFromUrl = () => {
        const url = this.url;
        const urlParts = url.split('/');
        const entryId = urlParts[urlParts.length - 1];
        if (entryId.length && entryId.length === 66 && entryId.startsWith('0x')) {
            return entryId;
        }
        return null;
    }
    getEntryType = (entry : Object) : number => {
        let { type } = entry;
        if(!type && entry.cardInfo.title.length) {
            type = 1;
        }
        return type;
    }
    getInfo = () => {
        const { pathname } = this.parsedUrl;
        let extension = null;
        let documentName = '';
        const isAkashaInternalLink = isInternalLink(this.parsedUrl.host);

        if(isAkashaInternalLink) {
            const entryId = this.getEntryIdFromUrl();
            if (entryId) {
                return this.requestAkashaEntry(entryId).then(resp => {
                    const entryType = this.getEntryType(resp.content);
                    switch (entryType) {
                        case 1:
                            return {
                                url: resp.content.cardInfo.url,
                                info: {
                                    title: resp.content.cardInfo.title,
                                    description: resp.content.cardInfo.description,
                                    image: resp.content.cardInfo.image
                                }
                            }
                        // default is case 0/'text entry type'
                        default:
                            return {
                                url: this.parsedUrl.href,
                                info: {
                                    title: resp.content.title,
                                    description: resp.content.excerpt,
                                    image: resp.content.featuredImage
                                }
                            }
                    }
                });
            }
        }

        if (pathname.split('.').length > 1) {
            extension = pathname.split('.')[pathname.split('.').length - 1];
            documentName = pathname.split('/')[pathname.split('/').length - 1];
        }

        if (extension && supportedDocs.includes(extension)) {
            return Promise.resolve({
                url: this.parsedUrl.href,
                info: {
                    title: `${documentName}`,
                    description: `This links to a ${extension.toUpperCase()} file`
                }
            });
        } else if (extension && !supportedDocs.includes(extension)) {
            return Promise.reject('The address provided is not a website!');
        }
        return this.requestWebsiteInfo(this.url)
            .then((websiteData) =>
                this.filterData(websiteData).then(filtered => ({
                    url: this.parsedUrl.href,
                    info: filtered
                })));
    }

    getParsedUrl = () => this.parsedUrl;
}

export { WebsiteParser };
