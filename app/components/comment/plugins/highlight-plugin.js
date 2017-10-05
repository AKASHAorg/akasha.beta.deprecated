import { CommentHighlight } from '../../';

export default () => ({
    blockRendererFn: (block, { getEditorState }) => {
        if (block.getType() === 'atomic') {
            const contentState = getEditorState().getCurrentContent();
            const entity = block.getEntityAt(0);
            if (!entity) return null;
            const type = contentState.getEntity(entity).getType();
            if (type === 'highlight') {
                return {
                    component: CommentHighlight,
                    editable: false,
                };
            }
            return null;
        }

        return null;
    }
});
