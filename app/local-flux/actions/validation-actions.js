import { ValidationService } from '../services';

let validationActions = null;

class ValidationActions {
    constructor (dispatch) {
        if (validationActions) {
            return validationActions;
        }
        this.validationService = new ValidationService();
        this.dispatch = dispatch;
        validationActions = this;
    }
    validateAkashaid = (akashaId, cb) => {
        this.validationService.validateakashaId(akashaId, {
            onError: err => cb(err),
            onSuccess: data => cb(null, data)
        });
    }
}
export { ValidationActions };
