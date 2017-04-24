import { ErrorState } from '../records/error-record';

export default class ErrorModel extends ErrorState {
    getFatal () {
        return this.errors.filter(err => err.get('fatal'));
    }
    getByCode (code) {
        return this.errors.filter(err => err.get('code') === code);
    }
}
