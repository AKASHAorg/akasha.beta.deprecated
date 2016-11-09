import Dexie from 'dexie';
import MultiResImage from './multi-res-image';
import EntryContent from './entry-content';

export function getDraftClass () {
    const Draft = Dexie.defineClass({
        id: String, // local id
        akashaId: String,
        title: String,
        content: EntryContent,
        tags: Array,
        excerpt: String,
        featuredImage: MultiResImage,
        wordCount: Number,
        status: {
            created_at: Date,
            updated_at: Date,
            publishing: Boolean,
            tagsPublished: Boolean,
            publishingConfirmed: Boolean,
            currentAction: 'String'
        } // local use
    });
    return Draft;
}
