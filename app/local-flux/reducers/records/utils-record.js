import { Record } from 'immutable';

const Flags = Record({
    backupPending: false
});

const UtilsState = Record({
    flags: new Flags(),
});

export default UtilsState;
