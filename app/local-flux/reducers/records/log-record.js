import { Record } from 'immutable';

export const LogRecord = Record({
    level: null,
    message: '',
    timestamp: Date.now(),
});
