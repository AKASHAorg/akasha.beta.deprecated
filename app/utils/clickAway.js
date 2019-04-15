// @flow
import * as React from 'react';

const supportedEvents /* : SupportedEvents */ = ['click', 'touchstart'];

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

/* @description Method to check if a given html elem (child) is child of parent html elem
 * @param parent <HTMLElement> parent element
 * @param child <HTMLElement> child element
 * @example
 *  given the markup
    `<div class="outer">
        <div id="sibling"></div>
        <div id="parent">
            <div id="child"></>
        </div>
    </div>`
    <script>
        let parent = document.getElementById('parent');
        let child = document.getElementById('child');
        let sibling = document.getElementById('sibling');
        isDescendant(parent, child) // true
        isDescendant(parent, sibling) // false
        isDescendant(sibling, child) // false
        //...etc
    </script>
 */
const isDescendant = (parent, child) => {
    let node = child.parentNode;

    while (node !== null) {
        if (node === parent) return true;
        node = node.parentNode;
    }
    return false;
};

/* @todo: ======== <DEPRECATE THIS AND DELETE IT> =========== */
const canClickAway = Component => {
    class ClickAwayable extends React.Component {
        getOwner = owner => {
            console.log(owner, 'used by: ', owner);
        };
        render () {
            this.getOwner(this._reactInternalFiber);
            console.warn('ClickAway is deprecated! Please update it with useOnClickAway hook!');
            return React.createElement(Component, this.props);
        }
    }
    return ClickAwayable;
};

export default function ClickAway (Component, props) {
    return canClickAway(...arguments);
}
/* ======== </DEPRECATE THIS AND DELETE IT> =========== */

/*
 * @description: A simple clickAway hook with manual onClick listener attachment.
 *      Useful for modals, alerts, etc
 *      Note: You cannot use this hook to toggle off using the same element that toggled on!
 *          If you want this functionality, use the more advanced, `useTogglerWithClickAway` hook!
 * @params ref <React.Ref> Reference to the element we chose to click away
 * @params handler <Function> Click handler
 * @params options <Object> Not used yet
 */
const useOnClickAway = (
    ref /* : React.ElementRef<any> */,
    handler /*: Handler */,
    options /*: ?ClickAwayOptions */
) /* : void */ => {
    const handlerRef = React.useRef(handler);

    React.useEffect(() => {
        handlerRef.current = handler;
    });
    React.useEffect(() => {
        if (!handlerRef.current) {
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
            handlerRef.current(ev);
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
/* @description: This hook let's you use clickAway and a toggler button (HTMLElement)
 *      Difference from simple clickAway:
 *          - when you click the toggler (togglerElemRef) the clickAway will not trigger
 *      Usefull when you want to control a panel from a button and also have the clickAway
 *      functionality
 *  @params: togglerElemRef <React.Ref> -> the trigger element ref / any html element acting as button
 *  @params: clickAwayElemRef <React.Ref> -> the element we want to be toggled.
 *      Also clicking outside this element will close it
 *  @params: handler<Function> -> click handler which receives the updated state
 *  @params toggled<Boolean> -> initial state of the clickAwayElemRef. False means closed/off
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
            console.log('clicked away');
            const targetIsToggler = ev.target === togglerElemRef.current;
            const targetIsClickAway = ev.target === clickAwayElemRef.current;
            const targetIsTogglerDescendant = isDescendant(togglerElemRef.current, ev.target);
            const targetIsClickAwayDescendant = isDescendant(clickAwayElemRef.current, ev.target);
            // stop event bubbling up because we clicked the actual togglerElement
            // so we don't want clickAway to trigger.
            if (targetIsToggler) {
                ev.stopPropagation();
            }
            // if toggler element is clicked
            if (targetIsToggler || targetIsTogglerDescendant) {
                return handlerRef.current(!toggled);
            }
            // if clicked away from clickAwayElemRef
            if (targetIsClickAway || targetIsClickAwayDescendant) {
                return;
            }
            // clicked outside so toggle it off;
            return handlerRef.current(!toggled);
        };
        supportedEvents.forEach(event => {
            if (togglerElemRef.current) {
                togglerElemRef.current.addEventListener(event, listener);
            } else {
                document.addEventListener(event, listener);
            }
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
