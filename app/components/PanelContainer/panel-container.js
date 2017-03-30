import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Paper } from 'material-ui';
import styles from './panel-container.scss';
import muiThemeable from 'material-ui/styles/muiThemeable';

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
        const childHeader = this.props.children.find(this._findChild(ALLOWED_HEADER_NAMES));
        this.childHeader = childHeader;
    }
    componentDidMount () {
        // attach resize listener and recalc panel.
        document.body.onresize = (ev) => this._calculatePanelSize(this.state);
    }
    componentWillUnmount () {
        document.body.onresize = null;
    }
    componentWillUpdate(nextProps, nextState) {
        if(nextState.headerHeight !== this.state.headerHeight) {
            this._calculatePanelSize(nextState);
        }
        if(nextProps.footerHeight !== this.props.footerHeight) {
            this._calculatePanelSize(nextState)
        }
    }
    _findChild = (childTypes) => {
        return (child) => {
            return !Array.isArray(child) && typeof child.type === 'function' &&
                childTypes.includes(child.type.name)
        }
    }
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
        if(Array.isArray(child)) return true;
        if(typeof child.type === 'function') {
            return this.childHeader && (child.type.displayName !== this.childHeader.type.displayName)
        } else {
            return true;
        }
    }
    _setHeight = (node) => {
        return (element) => {
            if(element) {
                this[`${node}Ref`]
                const { ref } = element;
                if(typeof ref === 'function') {
                    ref(element);
                }
                const htmlElem = ReactDOM.findDOMNode(element);
                const clientHeight = htmlElem.clientHeight;
                if(this.state[`${node}Height`] !== clientHeight) {
                    this.setState({
                        [`${node}Height`]: clientHeight
                    });
                }
            }
        };
    }
    render () {
        const { isHeaderShrinked, panelHeight } = this.state;
        const { header, title, subTitle, showBorder, headerHeight, headerMinHeight, headerStyle,
            contentStyle, muiTheme, intl } = this.props;
        return (
          <Paper
            className={`row ${styles.root}`}
            style={{maxWidth: this.props.width, ...this.props.style}}
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
              className={`row ${styles.panelContent}`}
              style={{...contentStyle, height: panelHeight }}
              ref={(panelContent) => { this.panelContent = panelContent; }}
              onScroll={this._handleScroll}
            >
              <div className={`${styles.panelContentInner}`}>
                {this.props.children.filter(this._filterContentChildren)}
              </div>
            </div> 
          </Paper>
        );
    }
}
PanelContainer.defaultProps = {
    width: '33.34%',
    headerHeight: 80,
    headerMinHeight: 56,
    headerStyle: {},
    contentStyle: {},
    footerHeight: 60
};
PanelContainer.propTypes = {
    actions: PropTypes.node,
    children: PropTypes.node,
    width: PropTypes.oneOfType([ // the power of JS :D
        PropTypes.string,
        PropTypes.number
    ]),
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    showBorder: PropTypes.bool,
    header: PropTypes.node,
    leftActions: PropTypes.node,
    style: PropTypes.shape(),
    subTitle: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    headerHeight: PropTypes.number,
    headerMinHeight: PropTypes.number,
    headerStyle: PropTypes.shape(),
    contentStyle: PropTypes.shape()
};

PanelContainer.contextTypes = {
    muiTheme: PropTypes.object.isRequired
};

export default muiThemeable() (PanelContainer);
