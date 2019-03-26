import { List, Map, Record } from 'immutable';

const ErrorRecord = Record({
    code: null,
    fatal: false,
    from: {},
    id: null,
    message: '',
    messageId: '',
    platform: '',
    values: {}
});

const ErrorState = Record({
    allIds: new List(),
    byId: new Map(),
    byType: new Map(),
    fatalErrors: new List(),
    nonFatalErrors: new List(),
    reportError: new Map()
});

export default class ErrorStateModel extends ErrorState {
    createError (state, error) {
        const err = new ErrorRecord(error);
        const lastErr = state.get('byId').last();
        const id = lastErr ? lastErr.get('id') + 1 : 1;
        return err.set('id', id);
    }
    addNewError (state, action) {
        console.log(action, 'the error action');
        const err = this.createError(state, action.error);
        const extra = err.fatal ? { fatalErrors: state.get('fatalErrors').push(err.id) } : null;

        return state.merge({
            allIds: state.get('allIds').push(err.id),
            byId: state.get('byId').set(err.id, err),
            ...extra
        });
    }
    getFatal () {
        return this.errors.filter(err => err.get('fatal'));
    }
    getByCode (code) {
        return this.errors.filter(err => err.get('code') === code);
    }
}
