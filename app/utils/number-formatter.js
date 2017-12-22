const appendZero = (str, length) => {
    do {
        str = `${str}0`;
    } while (str.length < length);
    return str;
};

export const balanceToNumber = (balance, precision = 0) => {
    if (!balance) {
        return 0;
    }
    let [integer, decimals] = balance.split('.');
    integer = integer.split(',').join('');
    let result = integer;
    if (decimals && decimals.length > precision) {
        decimals = decimals.slice(0, precision);
    }
    if (decimals && decimals.length) {
        result = `${result}.${decimals}`;
    }
    return Number(result);
};

export const formatBalance = (balance, length = 0) => {
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

export const removeTrailingZeros = (balance) => {
    const parts = balance.split('.');
    if (!parts[1]) {
        return balance;
    }
    const decimals = parts[1].replace(/0+$/, '');
    if (!decimals) {
        return parts[0];
    }
    return `${parts[0]}.${decimals}`;
};
