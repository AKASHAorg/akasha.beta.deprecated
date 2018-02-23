import ParserUtils from './parser-utils';
/**
 * parser for files exposed on web (.pdf, .txt, etc)
 */
class PDFParser extends ParserUtils {
    constructor ({ htmlString, parsedUrl }) {
        super();
        this.htmlString = htmlString;
        this.parsedUrl = parsedUrl;
    }

    static match (parsedUrl) {
        return parsedUrl.pathname.endsWith('.pdf');
    }

    getInfo = () => {
        return Promise.resolve({
            title: 'PDF File',
            description: 'A link to a pdf file',
        });
    }
}

export default PDFParser;
