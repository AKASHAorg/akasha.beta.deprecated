import Dexie from 'dexie';

const pendingAction = Dexie.defineClass({
    id: String,
    entityType: String,
    actionType: String,
    currentAction: String,
    publishTx: String,
    confirmed: Boolean,
    published: Boolean,
    gas: Number,
});

export default pendingAction;
