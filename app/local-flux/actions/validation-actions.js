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
    validateAkashaid = (akashaId, cb) => {
        this.validationService.validateakashaId(akashaId, {
            onError: err => cb(err),
            onSuccess: data => cb(null, data)
        });
    }
}
export { ValidationActions };
