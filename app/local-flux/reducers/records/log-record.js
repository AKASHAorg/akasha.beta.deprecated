import { Record } from 'immutable';

const LogRecord = Record({
    level: null,
    message: '',
    timestamp: Date.now(),
});

export default LogRecord;
