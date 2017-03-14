import { List, Map, Record } from 'immutable';

const ErrorRecord = Record({
    code: null,
    id: null,
    message: '',
    messageId: '',
    fatal: false,
    from: {}
});

const ErrorState = Record({
    allIds: new List(),
    byId: new Map(),
    fatalErrors: new List(),
    nonFatalErrors: new List(),
});

export default ErrorRecord;
export { ErrorState };
