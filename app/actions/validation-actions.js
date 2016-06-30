import { ValidationService } from '../services';

class ValidationActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.validationService = new ValidationService;
    }
    validateUsername = (userName, cb) => {
        this.validationService.validateUsername(userName).then(isValid => {
            return cb(isValid);
        });
    }
}

export { ValidationActions };
