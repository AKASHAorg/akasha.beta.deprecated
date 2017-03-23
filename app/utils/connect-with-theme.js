import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { shallowEqual } from 'utils/dataModule';

export default function connectWithTheme (mapStateToProps, mapDispatchToProps, Component) {
    const connectedComp = connect(mapStateToProps, mapDispatchToProps)(Component);

    // store and storeSubscription are needed by react-redux
    // muiTheme is added for detecting theme change
    connectedComp.contextTypes = {
        muiTheme: PropTypes.shape(),
        router: PropTypes.shape(),
        store: PropTypes.shape(),
        storeSubscription: PropTypes.shape(),
    };

    // overwrite the "shouldComponentUpdate" method on the connected component in order to
    // rerender on theme change (by default, the "shouldComponentUpdate" method implemented by
    // "connect" does not update the connected component on context change)
    // https://github.com/facebook/react/issues/2517
    // https://github.com/callemall/material-ui/issues/6106
    connectedComp.prototype.shouldComponentUpdate = function (nextProps, nextState, nextContext) {
        return !shallowEqual(this.props, nextProps) ||
            !shallowEqual(this.state, nextState) || !shallowEqual(this.context, nextContext);
    }

    return connectedComp;
}
