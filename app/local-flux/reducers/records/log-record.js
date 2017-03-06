import { Record } from 'immutable';

const LogRecord = Record({
    timestamp: Date.now(),
    message: ''
});

export default LogRecord;
