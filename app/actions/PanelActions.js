import * as types from '../constants/PanelConstants';

export function showPanel (panel) {
    return { type: types.SHOW_PANEL, panel };
}
export function hidePanels () {
    return { type: types.HIDE_PANELS };
}
/**
 * Changes currently visible panel
 * @param {Object} panel
 * @param {String} panel.name
 * @param {Boolean} panel.overlay Shows clickable overlay below panel. Useful to close the panel
 */
export function changePanel (panel) {
    return (dispatch) => dispatch(showPanel(panel));
}
