// @flow strict
import { List, Map, Record } from 'immutable';

/* ::
    import type { ActionParams, ErrorPayloadType } from '../../../flow-types/actions/action';
    import type { RecordOf, RecordInstance } from 'immutable';
 */

const ErrorRecord = Record({
    code: null,
    fatal: false,
    from: {},
    id: null,
    message: '',
    messageId: '',
    platform: '',
    values: {},
    title: ''
});

const ErrorState = Record({
    allIds: new List(),
    byId: new Map(),
    byType: new Map(),
    fatalErrors: new List(),
    nonFatalErrors: new List(),
    reportError: new Map()
});

export default class ErrorStateModel /* :: <ErrorState> */ extends ErrorState {
    createError (state, payload /* : ErrorPayloadType */) {
        const err = new ErrorRecord(payload);
        const lastErr = state.get('byId').last();
        const id = lastErr ? lastErr.get('id') + 1 : 1;
        return err.set('id', id);
    }
    addNewError (state /* : ErrorStateModel */, action /* : ActionParams */) {
        const payload = action.payload;
        const err = this.createError(state, payload);
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
