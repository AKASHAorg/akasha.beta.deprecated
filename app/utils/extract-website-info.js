import { htmlParser } from './html-parser';
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
    ]
};
const formatUrl = (url, prefix) => {
    if (url.startsWith(`${prefix}://`)) {
        return url;
    }
    return `${prefix}://${url}`;
};
const makeRequest = url =>
    new Promise((resolve) => {
        fetch(url).then((res) => {

            return resolve(res);
        });
    });

export const extractWebsiteInfo = (url) => {
    const reqHeaders = new Headers();
    reqHeaders.append('Content-Type', 'text/html');

    url = formatUrl(url, 'http');

    const requestParams = {
        method: 'GET',
        headers: reqHeaders,
        mode: 'cors'
    };
    const req = new Request(url, requestParams);
    fetch(req)
        .then((res) => {
            if (!res.ok) {
                return console.log('request failed!');
            }
            if ((res.ok && res.redirected) || redirectCodes.includes(res.status)) {
                console.log('request redirected... retrying to', res.url);
                return fetch(new Request(res.url, requestParams)).then(resp => resp.text());
            }
            return res.text();
        })
        .then(text => htmlParser(text, targetTags, url))
        .catch(err => console.error(err, 'some fetching errors'));
};
