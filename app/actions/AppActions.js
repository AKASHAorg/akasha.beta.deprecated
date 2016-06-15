import * as types from '../constants/AppConstants';

class AppActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
    }
    showError = (error) => {
        this.dispatch({ type: types.SHOW_ERROR, error });
    }
    clearErrors = () => {
        this.dispatch({ type: types.CLEAR_ERRORS });
    }
}

export { AppActions };
