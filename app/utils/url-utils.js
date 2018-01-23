const prefix = 'akasha.world';

export const addPrefix = (str = '') => `${prefix}${str}`;

export const isAbsolute = (route = '') => !route.startsWith('/');

export const isValidLink = (url = '') => {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    return url.match(regex);
};

export const isInternalLink = (value = '') =>
    value.startsWith(`${prefix}/`) ||
    value.startsWith(`/${prefix}/`) ||
    value.startsWith(`#/${prefix}/`);

export const prependHttp = (url = '') => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `http://${url}`;
};

export const removePrefix = (value = '') => {
    if (isAbsolute(value)) {
        return value.replace(prefix, '');
    }
    return value.replace(`/${prefix}`, '');
};
