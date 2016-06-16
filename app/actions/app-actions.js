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
    /**
     * Changes currently visible panel
     * @param {Object} panel
     * @param {String} panel.name
     * @param {Boolean} panel.overlay Shows clickable overlay below panel. Useful to close the panel
     */
    changePanel = (panel) => this.showPanel(panel);
    showPanel = (panel) => this.dispatch({ type: types.SHOW_PANEL, panel });
    hidePanels = () => this.dispatch({ type: types.HIDE_PANELS });
}

export { AppActions };
