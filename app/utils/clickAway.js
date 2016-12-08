import React from 'react';
import ReactDOM from 'react-dom';

const isDescendant = (parent, child) => {
    let node = child.parentNode;

    while (node !== null) {
        if (node === parent) return true;
        node = node.parentNode;
    }
    return false;
};

const canClickAway = (Component, props) => {
    class ClickAwayable extends React.Component {
        constructor (props) {
            super(props);
            this._bindClickAway = this._bindClickAway.bind(this);
            this._unbindClickAway = this._unbindClickAway.bind(this);
            this._checkClickAway = this._checkClickAway.bind(this);
        }
        componentDidMount () {
            this._bindClickAway();
        }
        componentWillUnmount () {
            this._unbindClickAway();
        }

        _checkClickAway (ev) {
            const el = ReactDOM.findDOMNode(this);
            if (ev.target !== el &&
            !isDescendant(el, ev.target) &&
            document.documentElement.contains(ev.target)) {
                if (this.refs.clickAwayableElement.componentClickAway) {
                    this.refs.clickAwayableElement.componentClickAway();
                }
            }
        }
        _bindClickAway () {
            document.addEventListener('click', this._checkClickAway);
        }
        _unbindClickAway () {
            document.removeEventListener('click', this._checkClickAway);
        }
        render () {
            return React.createElement(
                Component,
                Object.assign({}, this.props, { ref: 'clickAwayableElement' })
            );
        }
    }
    return ClickAwayable;
};

export default function ClickAway (Component, props) {
    return canClickAway(...arguments);
}
