export function isInViewport (element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 0 && rect.left >= 0 &&
        rect.bottom - 150 <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right - 150 <= (window.innerWidth || document.documentElement.clientWidth);
}