import { MENTION_HANDLE_REGEX } from '../';

const findWithRegex = (regex, contentBlock, cb) => {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    while ((matchArr = regex.exec(text)) !== null) {
        start = matchArr.index;
        cb(start, start + matchArr[0].length);
    }
};

const handleStrategy = (contentBlock, cb) => {
    findWithRegex(MENTION_HANDLE_REGEX, contentBlock, cb);
};

export default handleStrategy;
