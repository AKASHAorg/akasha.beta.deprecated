const HANDLE_REGEX = /\@[\w]+/g;

// strategy for @ handle
export function handleStrategy (contentBlock, cb) {
    const text = contentBlock.getText();
    let matchArr;
    let start;
    while ((matchArr = HANDLE_REGEX.exec(text)) !== null) {
        start = matchArr.index;
        cb(start, start + matchArr[0].length);
    }
}
