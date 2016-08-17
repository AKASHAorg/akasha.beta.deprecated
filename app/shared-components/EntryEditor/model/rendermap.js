import { map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

const RenderMap = map({
    unstyled: {
        element: 'div'
    },
    caption: {
        element: 'cite',
    },
    'block-quote-caption': {
        element: 'blockquote',
    }
}).merge(DefaultDraftBlockRenderMap);


export default RenderMap;
