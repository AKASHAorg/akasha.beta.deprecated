export function toStringVal (val) {
  return String(val);
}

export function toBoolVal (val) {
  return String(val) === 'true';
}

export function toIntVal (val) {
  return parseInt(val);
}

export function toIntValRestricted (val) {
  const check = parseInt(val);
  if (check > 0 && check <= 6) {
    return check;
  }
  return null;
}

export function toJSONObject (val) {
  try {
    return JSON.parse(val);
  } catch (e) {
    return val;
  }
}
