import { createTypeStrategy } from 'megadraft';
import { SUGGESTIONS_REGEX } from '../';

const findWithRegex = (regex, contentBlock, cb) => {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        cb(start, start + matchArr[0].length);
    }
};

const suggestionsStrategy = createTypeStrategy('MENTIONS_SUGGESTIONS');

// (contentBlock, cb) => {
//     findWithRegex(SUGGESTIONS_REGEX, contentBlock, cb);
// };

export default suggestionsStrategy;
