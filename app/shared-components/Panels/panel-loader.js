import React, { Component, PropTypes } from 'react';
import Panels from './index';


class PanelLoader extends Component {
    _handleOverlayClick = () => {
        const { appActions } = this.props;
        appActions.hidePanel();
    }
    render () {
        const { panelState, ...other } = this.props;
        const activePanel = panelState.get('activePanel');
        if (activePanel.get('name')) {
            const Panel = Panels[activePanel.get('name')];
            if (!Panel) {
                return null;
            }
            return (
              <div className="panel" style={{ height: '100%' }} >
                <Panel {...other} />
                {activePanel.get('overlay') &&
                  <div className="overlay" onClick={this._handleOverlayClick} />
                }
              </div>
            );
        }
        return null;
    }
}
PanelLoader.propTypes = {
    children: PropTypes.element,
    panelState: PropTypes.object,
    profileState: PropTypes.object,
    entryState: PropTypes.object,
    appActions: PropTypes.object
};
PanelLoader.contextTypes = {
    muiTheme: PropTypes.object
};
export default PanelLoader;
