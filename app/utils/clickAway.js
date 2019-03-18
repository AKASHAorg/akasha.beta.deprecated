// @flow
import * as React from "react";

const isDescendant = (parent, child) => {
    let node = child.parentNode;

    while (node !== null) {
        if (node === parent) return true;
        node = node.parentNode;
    }
    return false;
};

const canClickAway = Component => {
    class ClickAwayable extends React.Component {
        // constructor (props) {
        //     super(props);
        //     this._bindClickAway = this._bindClickAway.bind(this);
        //     this._unbindClickAway = this._unbindClickAway.bind(this);
        //     this._checkClickAway = this._checkClickAway.bind(this);
        // }
        // componentDidMount () {
        //     this._bindClickAway();
        // }
        // componentWillUnmount () {
        //     this._unbindClickAway();
        // }

        // _checkClickAway (ev) {
        //     const el = ReactDOM.findDOMNode(this);
        //     const exceptionEl = document.getElementById("notifications-panel__settings-popover");
        //     const isException = exceptionEl && isDescendant(exceptionEl, ev.target);
        //     const className = ev.target.getAttribute("class") || "";
        //     if (
        //         ev.target !== el &&
        //         !isDescendant(el, ev.target) &&
        //         document.documentElement.contains(ev.target) &&
        //         // ugly hack
        //         !className.includes("ant-select-dropdown-menu-item") &&
        //         !isException
        //     ) {
        //         if (this.refs.clickAwayableElement.componentClickAway) {
        //             this.refs.clickAwayableElement.componentClickAway();
        //         }
        //     }
        // }
        // _bindClickAway () {
        //     document.addEventListener("click", this._checkClickAway);
        // }
        // _unbindClickAway () {
        //     document.removeEventListener("click", this._checkClickAway);
        // }
        render () {
            console.warn("ClickAway HOC will be deprecated soon! Please update it with useOnClickAway hook!");
            return React.createElement(
                Component,
                Object.assign({}, this.props, { ref: "clickAwayableElement" })
            );
        }
    }
    return ClickAwayable;
};

export default function ClickAway (Component, props) {
    return canClickAway(...arguments);
}

/* ::
    type Event = SyntheticMouseEvent<HTMLElement> | SyntheticTouchEvent<HTMLElement>;
    type Handler = (ev: Event) => void;
    type EventNames = {
        TOUCHSTART: "touchstart",
        CLICK: "click"
    };
    type SupportedEvents = Array<$Values<EventNames>>;
    type ClickAwayOptions = {
        usePassiveEvent: ?boolean
    }
    type test = MouseEventTypes
 */

const supportedEvents /* : SupportedEvents */ = ["click", "touchstart"];

const useOnClickAway = (
    ref /* : React.ElementRef<any> */,
    handler /*: Handler */,
    options /*: ?ClickAwayOptions */
) /* : void */ => {
    // const handlerRef = React.useRef(handler);

    // React.useEffect(() => {
    //     handlerRef.current = handler;
    // });
    React.useEffect(() => {
        if (!handler) {
            return;
        }
        const listener = (ev /* : Event */) => {
            if (
                !ref.current ||
                ref.current === ev.target ||
                (ref.current.contains(ev.target) && isDescendant(ref.current, ev.target))
            ) {
                return;
            }
            handler(ev);
        };
        supportedEvents.forEach((eventName /* : EventNames */) => {
            //@todo check if passive event is supported and use it
            document.body.addEventListener(`${eventName}`, listener);
        });

        return () => {
            supportedEvents.forEach((eventName /* : EventNames */) => {
                document.body.removeEventListener(eventName, listener);
            });
        };
    }, [!handler]);
};
/* This hook let's you use clickAway and a toggler button (HTMLElement)
 * Difference from simple clickAway:
 *  - when you click the toggler (togglerElemRef) the clickAway will not trigger
        Usefull when you want to control a panel from a button and also have the clickAway
        funtionality
 */
const useTogglerWithClickAway = (
    togglerElemRef /* : React.ElementRef<any> */,
    clickAwayElemRef /* : React.ElementRef<any> */,
    handler /* : (toggled: boolean) => void */,
    toggled /* : boolean */
) => {
    const handlerRef = React.useRef(handler);
    React.useEffect(() => {
        handlerRef.current = handler;
    });
    React.useEffect(() => {
        const listener = (ev /* : Event */) => {
            const targetIsToggler = ev.target === togglerElemRef.current;
            const targetIsClickAway = ev.target === clickAwayElemRef.current;
            const targetIsTogglerDescendant = isDescendant(togglerElemRef.current, ev.target);
            const targetIsClickAwayDescendant = isDescendant(clickAwayElemRef.current, ev.target);
            // if toggler element is clicked
            if (targetIsToggler || targetIsTogglerDescendant) {
                return handlerRef.current(!toggled);
            }
            // if clicked away from clickAwayElemRef
            if (targetIsClickAway || targetIsClickAwayDescendant) {
                return;
            }
            return handlerRef.current(false);
        };
        supportedEvents.forEach(event => {
            if (togglerElemRef.current) {
                togglerElemRef.current.addEventListener(event, listener);
            }
            document.addEventListener(event, listener);
        });
        return () => {
            supportedEvents.forEach(event => {
                togglerElemRef.current.removeEventListener(event, listener);
                document.removeEventListener(event, listener);
            });
        };
    }, [toggled]);
};

export { useOnClickAway, useTogglerWithClickAway };
