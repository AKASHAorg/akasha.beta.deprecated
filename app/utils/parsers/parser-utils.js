// @flow
import { supportedProtocols } from './parser-config';
import { getResizedImages } from '../imageUtils';
import { uploadImage } from '../../local-flux/services/utils-service';

const PARSER_URL = 'https://beta.akasha.world/fetch-link';

class ParserUtils {
    fetchRequestParams = {
        method: 'GET',
        mode: 'no-cors'
    }
    makeParserRequest = (url: string) => {
        const parserUrl = `${PARSER_URL}?url=${url.toString()}`;
        try {
            return fetch(parserUrl).then(resp => resp.json());
        } catch (ex) {
            return Promise.reject('Unexpected error!');
        }
        // const reqParams = {
        //     ...this.fetchRequestParams,
        //     headers: reqHeaders
        // };
        // try {
        //     const req = new Request(url, reqParams);
        //     return new Promise((resolve, reject) => {
        //         fetch(req).then(resolve).catch(reject);
        //         setTimeout(() => {
        //             const error = new Error('Request timeout!');
        //             error.code = 408;
        //             reject(error);
        //         }, 5000);
        //     });
        // } catch (ex) {
        //     return Promise.reject('error!');
        // }

    }

    getUrlQueryParams = search => new URLSearchParams(search)

    getAbsoluteUrl = (url, parsedUrl) => {
        if (url) {
            return new URL(url, parsedUrl.href).href;
        }
        return null;
    }

    formatUrl = (url) => {
        const urlPrefix = ParserUtils.parseUrl(url).protocol;
        if (urlPrefix && supportedProtocols.includes(urlPrefix)) {
            return url;
        }
        return `${supportedProtocols[0]}//${url}`;
    }

    static parseUrl = (url) => {
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

    resizeImage = (image:string, { ipfsFile }: Object) => {
        let filePromises = [];

        if (image) {
            filePromises = getResizedImages([image], {
                ipfsFile
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
