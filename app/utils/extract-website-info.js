import { htmlParser, youtubeParser } from './parsers';
// <meta
//    property="meta.attributes.property.textContent"
//    content="meta.attributes.content.textContent"
// />
const redirectCodes = [301, 302, 303, 307, 308];

const targetTags = {
    metaName: [
        'application-name',
    ],
    metaProperty: [
        'og:title',
        'og:description',
        'og:type',
        'og:url',
        'og:image',
        'msapplication-TileColor',
        'msapplication-TileImage',
    ],
    tags: [
        'title',
        'h1',
        'h2',
        'p'
    ],
    ids: [
        'description',
        ''
    ]
};

const supportedProtocols = ['http:', 'https:'];

const parseUrl = (url) => {
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
};

const formatUrl = (url) => {
    const urlPrefix = parseUrl(url).protocol;

    if (urlPrefix && supportedProtocols.includes(urlPrefix)) {
        return url;
    }
    return `${supportedProtocols[0]}//${url}`;
};

export const extractWebsiteInfo = (url) => {
    const reqHeaders = new Headers();
    reqHeaders.append('Content-Type', 'text/html');

    url = formatUrl(url);

    const requestParams = {
        method: 'GET',
        headers: reqHeaders,
        mode: 'cors'
    };

    const req = new Request(url, requestParams);
    return fetch(req)
        .then((res) => {
            if (!res.ok) {
                return Promise.reject('request failed!');
            }
            if ((res.ok && res.redirected) || redirectCodes.includes(res.status)) {
                console.log('request redirected... retrying to', res.url);
                return fetch(new Request(res.url, requestParams)).then(resp => resp);
            }
            return res;
        }).then((res) => {
            const finalUrl = parseUrl(res.url);
            const superParser = new DOMParser();
            return res.text().then((htmlString) => {
                const htmlContent = superParser.parseFromString(htmlString, 'text/html');
                if (finalUrl.hostname.includes('youtube.com') || finalUrl.hostname.includes('youtu.be')) {
                    return youtubeParser(htmlContent, finalUrl, targetTags);
                }
                return htmlParser(htmlContent, finalUrl, targetTags);
            });
        })
        .catch(err => Promise.reject(err));
};
