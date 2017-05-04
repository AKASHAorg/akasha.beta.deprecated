import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';
import { Paper } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import styles from './panel-container.scss';

const ALLOWED_HEADER_NAMES = [
    'PanelContainerHeader',
    'PanelHeader'
];

class PanelContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isHeaderShrinked: false
        };
    }
    componentWillMount () {
        const { children } = this.props;
        const childHeader = children.find(this._findChild(ALLOWED_HEADER_NAMES));
        this.childHeader = childHeader;
    }
    componentDidMount () {
        // attach resize listener and recalc panel.
        document.body.onresize = () => this._calculatePanelSize(this.state);
    }
    componentWillUpdate (nextProps, nextState) {
        if (nextState.headerHeight !== this.state.headerHeight) {
            this._calculatePanelSize(nextState);
        }
        if (nextProps.footerHeight !== this.props.footerHeight) {
            this._calculatePanelSize(nextState);
        }
    }
    componentWillUnmount () {
        document.body.onresize = null;
    }
    _findChild = childTypes =>
        child =>
            !Array.isArray(child) && typeof child.type === 'function' &&
                childTypes.includes(child.type.name)

    _calculatePanelSize = (state) => {
        const { footerHeight } = this.props;
        const { headerHeight } = state;
        const { clientHeight } = document.body;
        this.setState({
            panelHeight: clientHeight - headerHeight - footerHeight - 1
        });
    }
    _handleScroll = () => {
        const panelNode = this.panelContent;
        const scrollTop = panelNode && panelNode.scrollTop;
        if (scrollTop >= 24) {
            this.setState({
                isHeaderShrinked: true
            });
        } else {
            this.setState({
                isHeaderShrinked: false
            });
        }
    };
    _filterContentChildren = (child) => {
        if (Array.isArray(child)) return true;
        if (typeof child.type === 'function') {
            return this.childHeader &&
                (child.type.displayName !== this.childHeader.type.displayName);
        }
        return true;
    }
    _setHeight = node =>
        (element) => {
            if (element) {
                this[`${node}Ref`] = element;
                const { ref } = element;
                if (typeof ref === 'function') {
                    ref(element);
                }
                const htmlElem = ReactDOM.findDOMNode(element);
                const clientHeight = htmlElem.clientHeight;
                if (this.state[`${node}Height`] !== clientHeight) {
                    this.setState({
                        [`${node}Height`]: clientHeight
                    });
                }
            }
        }

    render () {
        const { isHeaderShrinked, panelHeight } = this.state;
        const { showBorder, contentStyle, muiTheme, intl } = this.props;
        return (
          <Paper
            rounded={false}
            className={`col-xs-4 ${styles.root}`}
            style={{
                maxWidth: this.props.width,
                ...this.props.style
            }}
          >
            {this.childHeader &&
                React.cloneElement(this.childHeader, {
                    ref: this._setHeight('header'),
                    shrinked: isHeaderShrinked,
                    muiTheme,
                    showBorder,
                    intl
                })
            }
            <div
              className={`col-xs-12 ${styles.panelContent}`}
              style={{ ...contentStyle, height: panelHeight }}
              ref={(panelContent) => { this.panelContent = panelContent; }}
              onScroll={this._handleScroll}
            >
              <div className={`row ${styles.panelContentInner}`}>
                {this.props.children.filter(this._filterContentChildren)}
              </div>
            </div>
          </Paper>
        );
    }
}
PanelContainer.defaultProps = {
    headerHeight: 80,
    headerMinHeight: 56,
    headerStyle: {},
    contentStyle: {},
    footerHeight: 60
};
PanelContainer.propTypes = {
    children: PropTypes.node,
    width: PropTypes.oneOfType([ // the power of JS :D
        PropTypes.string,
        PropTypes.number
    ]),
    showBorder: PropTypes.bool,
    style: PropTypes.shape(),
    contentStyle: PropTypes.shape(),
    muiTheme: PropTypes.shape(),
    intl: PropTypes.shape(),
    footerHeight: PropTypes.number
};

PanelContainer.contextTypes = {
    muiTheme: PropTypes.object.isRequired
};

export default muiThemeable()(PanelContainer);
