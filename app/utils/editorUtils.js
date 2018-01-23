import { genKey } from 'draft-js';

export function getMentionsFromEditorState (editorState) {
    const mentions = [];
    const blocksArray = editorState.getCurrentContent().getBlocksAsArray();

    blocksArray.forEach((block) => {
        const blockTree = editorState.getBlockTree(block.key);
        blockTree.forEach((el) => {
            if (el.decoratorKey) {
                const akashaId = block.text.slice(el.start + 1, el.end);
                if (mentions.indexOf(akashaId) === -1) {
                    mentions.push(akashaId);
                }
            }
        });
    });

    return mentions;
}

export function getContentStateFragment (contentState, selectionState) {
    const startKey = selectionState.getStartKey();
    const startOffset = selectionState.getStartOffset();
    const endKey = selectionState.getEndKey();
    const endOffset = selectionState.getEndOffset();

    // Edge entities should be stripped to ensure that we don't preserve
    // invalid partial entities when the fragment is reused. We do, however,
    // preserve entities that are entirely within the selection range.
    // const contentWithoutEdgeEntities = removeEntitiesAtEdges(contentState, selectionState);

    const blockMap = contentState.getBlockMap();
    const blockKeys = blockMap.keySeq();
    const startIndex = blockKeys.indexOf(startKey);
    const endIndex = blockKeys.indexOf(endKey) + 1;

    const slice = blockMap.slice(startIndex, endIndex).map((block, blockKey) => {
        const newKey = genKey();

        const text = block.getText();
        const chars = block.getCharacterList();

        if (startKey === endKey) {
            return block.merge({
                key: newKey,
                text: text.slice(startOffset, endOffset),
                characterList: chars.slice(startOffset, endOffset),
            });
        }

        if (blockKey === startKey) {
            return block.merge({
                key: newKey,
                text: text.slice(startOffset),
                characterList: chars.slice(startOffset),
            });
        }

        if (blockKey === endKey) {
            return block.merge({
                key: newKey,
                text: text.slice(0, endOffset),
                characterList: chars.slice(0, endOffset),
            });
        }

        return block.set('key', newKey);
    });

    return slice.toOrderedMap();
}

export const getCurrentEntityKey = (editorState) => {
    const selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const contentState = editorState.getCurrentContent();
    const anchorBlock = contentState.getBlockForKey(anchorKey);
    const offset = selection.anchorOffset;
    const index = selection.isBackward ? offset - 1 : offset;
    return anchorBlock.getEntityAt(index);
};

export const getCurrentEntity = (editorState) => {
    const contentState = editorState.getCurrentContent();
    const entityKey = getCurrentEntityKey(editorState);
    return entityKey ? contentState.getEntity(entityKey) : null;
};

export const hasEntity = (editorState, entityType) => {
    const entity = getCurrentEntity(editorState);
    return entity && entity.getType() === entityType;
};
