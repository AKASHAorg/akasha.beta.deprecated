import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import Panels from './index';

class PanelLoader extends Component {
    componentWillReceiveProps (nextProps) {
        if (nextProps.panelState.get('activePanel') !== this.props.panelState.get('activePanel')) {
            ReactTooltip.hide();
        }
    }
    componentDidUpdate () {
        ReactTooltip.rebuild();
    }
    componentWillUnmount () {
        ReactTooltip.hide();
    }
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
