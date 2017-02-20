function getMentionsFromEditorState (editorState) {
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

export { getMentionsFromEditorState };
