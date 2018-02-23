import htmlParser from './html-parser';
import youtubeParser from './youtube-parser';
import pdfParser from './pdf-parser';
/**
 * Custom parsers.
 * Must implement a static `match` function which returns a boolean
 */
export {
    pdfParser,
    youtubeParser,
};

/**
 * this is the default parser
 * used when not other parser matches the hostname
 */
export default htmlParser;
