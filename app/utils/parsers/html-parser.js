import ParserUtils from './parser-utils';
import { targetMetaTags, targetTags } from './parser-config';

class HtmlParser extends ParserUtils {
    constructor ({ htmlString, parsedUrl, uploadImageToIpfs }) {
        super({ uploadImageToIpfs });
        this.parsedUrl = parsedUrl;
        this.htmlString = htmlString;
        this.uploadImageToIpfs = uploadImageToIpfs;
        this.htmlContent = null;
    }

    getInfo = () => {
        this.htmlContent = this.parseHtmlFromString(this.htmlString);
        return Promise.all([
            this.parseTags(),
            this.parseMetaTags(),
            this.parseOGMetaTags(),
        ]).then(infoArr => infoArr.reduce((prev, curr) => Object.assign({}, prev, curr)));
    }
    /**
     * parse Open graph meta tags
     */
    parseOGMetaTags = () => {
        // extract meta tag info
        const htmlMetaTags = Array.from(this.htmlContent.getElementsByTagName('meta'));
        const props = targetMetaTags.metaProperties.map((property) => {
            const tag = htmlMetaTags.find(fTag =>
                fTag.attributes.length &&
                fTag.attributes.property &&
                fTag.attributes.property.textContent === property.name
            );
            if (tag) {
                return Promise.resolve({
                    [property.key]: tag.attributes.content.textContent,
                });
            }
            return Promise.resolve({});
        });
        return Promise.all(props).then(values =>
            values.reduce((prev, current) =>
                Object.assign({}, prev, current))
        );
    }

    parseMetaTags = () => {
        const props = targetMetaTags.metaNames.map((tag) => {
            const domTag = this.htmlContent.getElementsByTagName('meta')[tag.name];
            if (domTag) {
                return Promise.resolve({
                    [tag.key]: domTag.content
                });
            }
            return Promise.resolve({});
        });
        return Promise.all(props).then(values =>
            values.reduce((prev, current) => Object.assign({}, prev, current))
        );
    }
    parseTags = () => {
        const props = targetTags.map((tag) => {
            const domTag = Array.from(this.htmlContent.getElementsByTagName(tag.name))
                .filter(item => (item.textContent.length > 0 || item.attributes.src));

            if (domTag.length > 0) {
                if (domTag[0].tagName === 'IMG') {
                    return Promise.resolve({
                        [tag.key]: domTag[0].attributes.src.textContent
                    });
                }
                return Promise.resolve({
                    [tag.key]: domTag[0].innerText
                });
            }
            return Promise.resolve({});
        });

        return Promise.all(props).then(val => val.reduce((prev, curr) => Object.assign({}, curr, prev)));
    }
    parseClassNames = () => {
        console.info('not implemented yet!');
    }
}
export default HtmlParser;
