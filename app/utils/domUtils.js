export function isInViewport (element, offset = 0) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 &&
        rect.bottom - offset <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right - offset <= (window.innerWidth || document.documentElement.clientWidth);
}
