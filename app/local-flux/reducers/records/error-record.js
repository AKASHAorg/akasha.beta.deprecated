import { Record } from 'immutable';

const ErrorRecord = Record({
    code: null,
    message: '',
    fatal: false,
    from: {}
});

export default ErrorRecord;
