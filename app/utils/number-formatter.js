const appendZero = (str, length) => {
    do {
        str = `${str}0`;
    } while (str.length < length);
    return str;
};

export const formatBalance = (balance, length) => {
    if (!balance) {
        return '';
    }
    const parts = balance.split('.');
    if (parts[0].length >= length) {
        return parts[0];
    }
    if (balance.length >= length) {
        if (parts[0].length === length - 1) {
            return balance.slice(0, length + 1);
        }
        return balance.slice(0, length);
    }
    if (!parts[1]) {
        balance = `${balance}.`;
    }
    return appendZero(balance, length);
};
