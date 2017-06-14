import XRegExp from 'xregexp';

/* eslint-disable no-bitwise */
export const genId = () => {
    const chars = '0123456789abcdef'.split('');
    const uuid = [];
    const rnd = Math.random;
    let r;
    uuid[8] = '-';
    uuid[13] = '-';
    uuid[18] = '-';
    uuid[23] = '-';
    uuid[14] = '4'; // v4

    for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
            r = 0 | rnd() * 16;
            uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r & 0xf];
        }
    }
    return uuid.join('');
};
/* eslint-enable no-bitwise */

export const calculateReadingTime = (wordCount = 0, options = {}) => {
    let minutes;
    let hours = null; // hopefully not the case :)
    options.wordsPerMinute = options.wordsPerMinute || 185;

    const time = wordCount / options.wordsPerMinute;
    minutes = Math.floor(time);
    if (minutes > 60) {
        hours = Math.floor(minutes / 60);
        minutes %= 60;
    }

    return {
        hours,
        minutes
    };
};

export const getWordCount = (content) => {
    const plainText = content.getPlainText('');
    const matchWords = plainText.match(/[^~`!¡@#$%^&*()_\-+={}\[\]|\\:;"'<,>.?¿\/\s]+/g);
    return matchWords ? matchWords.length : 0;
};

export const validateTag = (tagName) => {
    const tag = tagName ? tagName.trim().toLowerCase() : '';
    const ALPHANUMERIC_REGEX = /^(?:[a-zA-Z0-9]+(?:(-|_)(?!$))?)+$/;
    let error = null;
    if (tag.length > 3 && tag.length <= 24) {
        if (!ALPHANUMERIC_REGEX.test(tag)) {
            error = 'alphanumericError';
        }
    } else if (tag.length > 24) {
        error = 'tooLongError';
    } else {
        error = 'tooShortError';
    }
    return error;
};

export function getInitials (firstName, lastName = '') {
    if (!firstName && !lastName) {
        return '';
    }
    const unicodeLetter = XRegExp('^\\pL');
    const lastNameMatch = lastName && lastName.match(unicodeLetter);
    const lastNameInitial = lastNameMatch && lastNameMatch[0] ? lastNameMatch[0] : '';
    const firstNameMatch = firstName && firstName.match(unicodeLetter);
    const firstNameInitial = lastNameInitial ?
        (firstNameMatch && firstNameMatch[0] ? firstNameMatch[0] : '') :
        firstName
            .split(' ')
            .map((str) => {
                const chars = str.match(unicodeLetter);
                if (chars && chars[0]) {
                    return chars[0];
                }
                return '';
            })
            .reduce((prev, current) => prev + current, '');
    const initials = `${firstNameInitial}${lastNameInitial}`;
    return initials ?
        initials.slice(0, 2) :
        '';
}

export function getUrl (url) {
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `http://${url}`;
}
