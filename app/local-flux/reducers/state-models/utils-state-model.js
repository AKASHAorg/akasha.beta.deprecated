import { Record } from 'immutable';

const Flags = Record({
    backupPending: false
});

export const UtilsState = Record({
    flags: new Flags(),
});

export default class UtilsStateModel extends UtilsState {
    
}