import ParserUtils from './parser-utils';
import { targetMetaTags } from './parser-config';

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
        return this.parseOGMetaTags();
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

    parseTags = (targetTags) => {
        const props = targetTags.map((tag) => {
            const domTags = this.htmlContent.getElementsByTagName(tag.name);
            if (domTags.length > 0) {
                return Promise.resolve({
                    [tag.propertyName]: domTags[0].innerText
                });
            }
            return Promise.resolve({});
        });
        return Promise.all(props).then(values =>
            values.reduce((prev, current) => Object.assign({}, prev, current))
        );
    }
    parseClassNames = (targetClassNames) => {
        console.log('not implemented yet!');
    }
}
export default HtmlParser;
