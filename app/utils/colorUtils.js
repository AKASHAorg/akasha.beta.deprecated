const getHexFromRgb = (rgb) => {
    const r = `0${ (parseInt(rgb[1], 10).toString(16)).slice(-2) }`;
    const g = `0${ (parseInt(rgb[2], 10).toString(16)).slice(-2) }`;
    const b = `0${ (parseInt(rgb[3], 10).toString(16)).slice(-2) }`;
    return {
        r, g, b
    };
};

const getLuma = (color) => {
    const rgb = color.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    if (rgb && rgb.length >= 3) {
        const { r, g, b } = getHexFromRgb(rgb);
        return [
            0.299 * r,
            0.587 * g,
            0.114 * b
        ].reduce((p, c) => p + c) / 255;
    }

    if (color.startsWith('#')) {
        const hex = color.replace(/#/, '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return [
            0.299 * r,
            0.587 * g,
            0.114 * b
        ].reduce((p, c) => p + c) / 255;
    }

    const div = document.createElement('div');
    div.style.color = color;
    div.style.height = 0;
    div.style.width = 0;
    document.body.appendChild(div);
    const col = window.getComputedStyle(div).color;
    document.body.removeChild(div);
    return getLuma(`${ col }`);
};

export const getTextColor = (color) => {
    const luma = getLuma(color);
    if (luma < 0.51) {
        return '#FFF';
    }
    return '#444';
};
