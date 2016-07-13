import Dexie from 'dexie';
import MultiResImage from './multi-res-image';
import EntryContent from './entry-content';

export function getDraftClass (db) {
    const Draft = Dexie.defineClass({
        id: String, // local id
        title: String,
        content: EntryContent,
        tags: Array,
        excerpt: String,
        featuredImage: [[MultiResImage]]
    });

    Draft.prototype.save = function () {
        console.log(this, 'zis!');
        return db.drafts.put(this);
    };
    return Draft;
}
