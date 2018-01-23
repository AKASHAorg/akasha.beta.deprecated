const prefix = 'akasha.world';

export const addPrefix = str => `${prefix}${str}`;

export const isAbsolute = route => !route.startsWith('/');

export const isInternalLink = value =>
    value.startsWith(`${prefix}/`) || value.startsWith(`/${prefix}/`);

export const prependHttp = (url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `http://${url}`;
};

export const removePrefix = (value) => {
    if (isAbsolute(value)) {
        return value.replace(prefix, '');
    }
    return value.replace(`/${prefix}`, '');
};
