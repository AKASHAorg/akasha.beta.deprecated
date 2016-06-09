import * as types from '../constants/PanelConstants';

class PanelActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
    }
    showPanel = (panel) => this.dispatch({ type: types.SHOW_PANEL, panel });
    hidePanels = () => this.dispatch({ type: types.HIDE_PANELS });
    /**
     * Changes currently visible panel
     * @param {Object} panel
     * @param {String} panel.name
     * @param {Boolean} panel.overlay Shows clickable overlay below panel. Useful to close the panel
     */
    changePanel = (panel) => this.showPanel(panel);
}

export { PanelActions };
