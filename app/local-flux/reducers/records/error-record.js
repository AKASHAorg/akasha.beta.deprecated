import { Record } from 'immutable';

const ErrorRecord = Record({
    code: null,
    message: '',
    fatal: false,
    from: {}
});

const ErrorState = Record({
    errors: new Set()
});

export default ErrorRecord;
export { ErrorState };
