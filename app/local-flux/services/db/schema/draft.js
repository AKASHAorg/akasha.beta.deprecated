import Dexie from 'dexie';
import EntryContent from './entry-content';

const draftSchema = Dexie.defineClass({
    id: String, // local id
    akashaId: String,
    content: EntryContent,
    tags: Array,
    created_at: Date,
    updated_at: Date,
    tx: String
});
export default draftSchema;
