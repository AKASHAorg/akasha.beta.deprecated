/**
 * This an example of parser class
 * - it will be instantiated with param object with keys:
 *    string -> htmlString (the web page)
 *    object -> parsedUrl
 * - it requires a static method `match` with param `hostname` {obj}
 * - it requires an instance method getInfo() which will return a promise that when resolved will
 * return an object:
 * {
 *    title: '',
 *    image: {xs: ..., md: ...},
 *    description: '',
 *    bgColor: ''
 * }
 */

class SampleParser {
    constructor ({ htmlString, parsedUrl }) {
        // do something with params
        this.htmlString = htmlString;
        this.parsedUrl = parsedUrl;
    }
    static match (hostname) {
        // do something with hostname
        return hostname.includes('youtube');
    }
    getInfo = () => {
        return Promise.resolve({
            title: 'some title',
            description: '',
            // ...
        });
    }
}
// don`t forget to add your parser to index.js
export default SampleParser;
