import htmlParser, * as parsers from './parsers';
import ParserUtils from './parsers/parser-utils';
import { redirectCodes } from './parsers/parser-config';
// <meta
//    property="meta.attributes.property.textContent"
//    content="meta.attributes.content.textContent"
// />

/**
 * Url parser module, used to extract info from a website`s html content
 * @param {*} url website`s url
 * Usage:
 *   const websiteParser = new WebsiteParser('www.akasha.world')
 *   websiteParser.getInfo([options]).then(info:<Object>);
 */
class WebsiteParser extends ParserUtils {
    constructor ({ url, uploadImageToIpfs }) {
        super();
        this.url = this.formatUrl(url);
        this.parsedUrl = {};
        this.uploadImageToIpfs = uploadImageToIpfs;
    }

    requestHtmlString = url =>
        this.makeRequest(url, 'text/html').then((response) => {
            const { ok, status, redirected } = response;
            if (!ok) {
                const error = new Error('Request failed! Cannot generate card!');
                error.code = 500;
                return Promise.reject(error);
            }
            if ((ok && redirected) || redirectCodes.includes(status)) {
                // console.info('request redirected to:', response.url);
                this.requestHtmlString(response.url);
            }
            return response;
        });

    getInfo = () =>
        this.requestHtmlString(this.url).then((resp) => {
            this.parsedUrl = ParserUtils.parseUrl(resp.url);
            return resp.text();
        }).then(htmlString =>
            this.matchParser().then((MatchingParser) => {
                const parser = new MatchingParser({
                    htmlString,
                    parsedUrl: this.parsedUrl
                });
                return parser.getInfo();
            })).then(info =>
            this.resizeImage(this.getAbsoluteUrl(info.image, this.parsedUrl), {
                ipfsFile: true
            }).then((image) => {
                let img = {};
                if (image) {
                    img = image;
                }
                return {
                    url: this.parsedUrl.href,
                    info: {
                        ...info,
                        image: img
                    }
                };
            }).catch(() => ({
                url: this.parsedUrl.href,
                info: {
                    ...info,
                    image: {}
                }
            })));

    matchParser = () =>
        new Promise((resolve) => {
            Object.keys(parsers).forEach((parserKey) => {
                const parser = parsers[parserKey];
                if (parserKey !== 'default' && parser.match(this.parsedUrl)) {
                    resolve(parser);
                }
            });
            resolve(htmlParser);
        })

    getParsedUrl = () => this.parsedUrl;
}

export { WebsiteParser };
