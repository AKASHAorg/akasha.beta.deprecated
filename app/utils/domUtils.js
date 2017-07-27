export function isInViewport (element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 &&
        rect.bottom - offset <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right - offset <= (window.innerWidth || document.documentElement.clientWidth);
}

// calculates if a given element is visible within its container;
// if element is visible, returns true; if not, returns false and
// the value (in px) that needs to be scrolled for the element to be visible;
export function isVisible (element, container, offsetTop = 0, offsetBottom = 0) {
    const e = element.getBoundingClientRect();
    const c = container.getBoundingClientRect();
    const topDifference = c.top + offsetTop - e.top; // eslint-disable-line no-mixed-operators
    const bottomDifference = c.bottom - e.bottom - offsetBottom;
    if (topDifference > 0) {
        return { visible: false, scrollTop: topDifference };
    }
    if (bottomDifference < 0) {
        return { visible: false, scrollTop: bottomDifference };
    }
    const visible = e.left >= c.left && e.right <= c.right;
    return { visible };
}
