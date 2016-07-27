import Dexie from 'dexie';
import MultiResImage from './multi-res-image';
import EntryContent from './entry-content';

export function getDraftClass () {
    const Draft = Dexie.defineClass({
        id: String, // local id
        title: String,
        content: EntryContent,
        tags: Array,
        excerpt: String,
        featuredImage: [MultiResImage],
        updated_at: String,
        created_at: String
    });
    return Draft;
}
