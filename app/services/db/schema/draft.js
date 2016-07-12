import MultiResImage from './multi-res-image';
import EntryContent from './entry-content';

export function draftSchema () {
    return {
        id: String, // local id
        title: String,
        content: EntryContent,
        tags: Array,
        excerpt: String,
        featuredImage: [[MultiResImage]]
    };
}
