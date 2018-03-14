// @flow
const prefix = 'akasha.world';

export const addPrefix = (str: string = ''): string => `${prefix}${str}`;

export const isAbsolute = (route: string = ''): boolean => !route.startsWith('/');

export const isValidLink = (url: string = ''): boolean => {
    const expression = /[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    return !!url.match(regex);
};

export const isInternalLink = (value: string = ''): boolean =>
    value.startsWith(`${prefix}/`) ||
    value.startsWith(`/${prefix}/`) ||
    value.startsWith(`#/${prefix}/`);

export const prependHttp = (url: string = ''): string => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `http://${url}`;
};

export const removePrefix = (value: string = ''): string => {
    if (isAbsolute(value)) {
        return value.replace(prefix, '');
    }
    return value.replace(`/${prefix}`, '');
};
