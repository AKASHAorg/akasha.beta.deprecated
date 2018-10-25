// @flow
import { supportedProtocols } from './parser-config';
import { getResizedImages } from '../imageUtils';
import { uploadImage } from '../../local-flux/services/utils-service';

const PARSER_URL = 'https://beta.akasha.world/fetch-link';

const ParserUtils = {
    fetchRequestParams: {
        method: 'GET',
        mode: 'no-cors'
    },
    makeParserRequest: (url: string) => {
        const parserUrl = `${PARSER_URL}?url=${url.toString()}`;
        try {
            return fetch(parserUrl).then(resp => resp.json());
        } catch (ex) {
            return Promise.reject('Unexpected error!');
        }
    },

    getUrlQueryParams: (search: string) => new URLSearchParams(search),

    getAbsoluteUrl: (url: string, parsedUrl: Object) : string => {
        if (url) {
            return new URL(url, parsedUrl.href).href;
        }
        return '';
    },

    formatUrl: (url: string): string => {
        if (!url.startsWith('http')) {
            return `http://${url}`;
        }
        return url;
    },

    parseUrl: (url: string) => {
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
    },

    resizeImage: (image:string, { ipfsFile }: Object): Promise<Object> => {
        let filePromises = [];

        if (image.length) {
            filePromises = getResizedImages([image], {
                ipfsFile
            });
        }

        return Promise.all(filePromises).then((results) => {
            let promise: Promise<Object> = Promise.resolve({});
            if (results[0]) {
                promise = uploadImage(results[0]);
            }
            return promise;
        });
    }
}

export default ParserUtils;
