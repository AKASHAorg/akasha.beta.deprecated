import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Paper } from 'material-ui';
import styles from './panel-container.scss';
import muiThemeable from 'material-ui/styles/muiThemeable';
class PanelContainer extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isHeaderShrinked: false
        };
    }
    componentWillMount () {
        const { children } = this.props;
        const childHeader = this.props.children.find(child => !Array.isArray(child) &&
            child.type.displayName === 'PanelContainerHeader');
        const childFooter = this.props.children.find(child => !Array.isArray(child) &&
            child.type.displayName === 'PanelContainerFooter');
        if(!childHeader) {
            console.warn('PanelContainer must have <PanelHeader/> as children!');
        };
        if(!childFooter && React.Children.count(children) > 2) {
            console.warn('Please use <PanelFooter /> component for PanelContainer actions!');
        };
        this.childHeader = childHeader;
        this.childFooter = childFooter;
    }
    componentDidMount () {
        // measure body and set the height of the content
        // to the height of the body - header - footer
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

    render () {
        const { isHeaderShrinked } = this.state;
        const { header, title, subTitle, showBorder, headerHeight, headerMinHeight, headerStyle,
            contentStyle } = this.props;
        const { muiTheme } = this.props;
        return (
          <Paper
            className={styles.root}
            style={{maxWidth: this.props.width, ...this.props.style}}
          >
            {this.childHeader &&
                React.cloneElement(this.childHeader, {
                    shrinked: isHeaderShrinked,
                    muiTheme
                })
            }
            <div
              className={`row ${styles.panelContent}`}
              style={{...contentStyle, top: isHeaderShrinked && 56 }}
              ref={(panelContent) => { this.panelContent = panelContent; }}
              onScroll={this._handleScroll}
            >
              {this.props.children.filter(child => !Array.isArray(child) &&
                child.type.displayName !== 'PanelContainerHeader' &&
                    child.type.displayName !== 'PanelContainerFooter')
              }
            </div>
            {this.childFooter &&
                React.cloneElement(this.childFooter, {
                    muiTheme
                })
            }
          </Paper>
        );
    }
}
PanelContainer.defaultProps = {
    width: '33.34%',
    headerHeight: 80,
    headerMinHeight: 56,
    headerStyle: {},
    contentStyle: {}
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
