import getWordAt from './get-word-at';

const getSearchText = (editorState, selection) => {
    const anchorKey = selection.getAnchorKey();
    const anchorOffset = selection.getAnchorOffset() - 1;
    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(anchorKey);
    const blockText = currentBlock.getText();

    return getWordAt(blockText, anchorOffset);
};

export default getSearchText;
