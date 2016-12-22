export function hoursMinutesSeconds (date) {
    return `${zeroPadding(date.getHours(), 2)}:${zeroPadding(date.getMinutes(), 2)}:${zeroPadding(date.getSeconds(), 2)}`;
}

function zeroPadding (number, digits) {
    let result = number.toString();
    while (result.length < digits) {
        result = `0${result}`;
    }
    return result;
}
