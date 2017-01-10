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
            document.body.style.overflow = 'hidden';
            const Panel = Panels[activePanel.get('name')];
            if (!Panel) {
                return null;
            }
            return (
              <div className="panel" style={{ height: '100%', position: 'fixed' }} >
                <Panel {...other} />
                {activePanel.get('overlay') &&
                  <div className="overlay" onClick={this._handleOverlayClick} />
                }
              </div>
            );
        }
        document.body.style.overflow = 'auto';
        return null;
    }
}
PanelLoader.propTypes = {
    children: PropTypes.element,
    panelState: PropTypes.shape(),
    appActions: PropTypes.shape()
};
PanelLoader.contextTypes = {
    muiTheme: PropTypes.shape()
};
export default PanelLoader;
