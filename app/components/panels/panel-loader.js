import React, { Component, PropTypes } from 'react';
import Panels from './index';


class PanelLoader extends Component {
    render () {
        const { panelState } = this.props;
        const activePanel = panelState.get('activePanel');
        if (activePanel.get('name')) {
            const Panel = Panels[activePanel.get('name')];
            return (
              <div className="panel" style={{ height: '100%' }} >
                <Panel />
                  {activePanel.get('overlay') &&
                    <div className="overlay" />
                  }
              </div>
            );
        }
        return null;
    }
}
PanelLoader.propTypes = {
    children: PropTypes.element,
    panelState: PropTypes.object
};
PanelLoader.contextTypes = {
    muiTheme: PropTypes.object
};
export default PanelLoader;
