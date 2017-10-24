import htmlParser from './html-parser';
import youtubeParser from './youtube-parser';

/**
 * Custom parsers.
 * Must implement a static `match` function which returns a boolean
 */
export {
    youtubeParser,
};

/**
 * this is the default parser
 * used when not other parser matches the hostname
 */
export default htmlParser;
