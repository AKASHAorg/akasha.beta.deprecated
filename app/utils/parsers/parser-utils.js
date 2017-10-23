import { supportedProtocols } from './parser-config';
import { getResizedImages } from '../imageUtils';
import { uploadImage } from '../../local-flux/services/utils-service';

class ParserUtils {
    constructor () {
        this.fetchRequestParams = {
            method: 'GET',
            mode: 'cors'
        };
    }
    makeRequest = (url, contentType = 'application/json') => {
        const reqHeaders = new Headers();
        reqHeaders.append('Content-Type', contentType);
        const reqParams = { ...this.fetchRequestParams, headers: reqHeaders };
        const req = new Request(url, reqParams);
        return fetch(req);
    }
    getUrlQueryParams = search => new URLSearchParams(search)
    getAbsoluteUrl = (url, parsedUrl) => {
        if (url) {
            return new URL(url, parsedUrl.href).href;
        }
        return null;
    }
    formatUrl = (url) => {
        const urlPrefix = this.parseUrl(url).protocol;
        if (urlPrefix && supportedProtocols.includes(urlPrefix)) {
            return url;
        }
        return `${supportedProtocols[0]}//${url}`;
    }
    parseUrl = (url) => {
        const link = document.createElement('a');
        link.href = url;
        return {
            host: link.host,
            hostname: link.hostname,
            pathname: link.pathname,
            origin: link.origin,
            protocol: link.protocol,
            search: link.search,
            href: link.href,
        };
    }
    parseHtmlFromString = (htmlString) => {
        const superParser = new DOMParser();
        return superParser.parseFromString(htmlString, 'text/html');
    }
    resizeImage = (image, { uploadImageToIpfs }) => {
        let filePromises = [];
        if (image) {
            filePromises = getResizedImages([image], {
                ipfsFile: uploadImageToIpfs
            });
        }
        return Promise.all(filePromises).then((results) => {
            let promise = Promise.resolve();
            if (results[0]) {
                promise = uploadImage(results[0]);
            }
            return promise;
        });
    }
}

export default ParserUtils;
