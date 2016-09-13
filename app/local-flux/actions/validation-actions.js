import { ValidationService } from '../services';

let validationActions = null;

class ValidationActions {
    constructor (dispatch) {
        if (!validationActions) {
            validationActions = this;
        }
        this.validationService = new ValidationService();
        this.dispatch = dispatch;
        return validationActions;
    }
    validateUsername = (userName, cb) => {
        this.validationService.validateUsername(userName).then(isValid => {
            return cb(isValid);
        });
    }
}
export { ValidationActions };
