import Dexie from 'dexie';
import EntryContent from './entry-content';

const draftSchema = Dexie.defineClass({
    id: String, // local id
    ethAddress: String,
    content: EntryContent,
    tags: Array,
    created_at: Date,
    updated_at: Date,
    localChanges: Boolean,
    type: String,
    tx: String
});
export default draftSchema;
