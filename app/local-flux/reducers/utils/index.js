// @flow
export { createReducer } from './create-reducer';

/* Simple utility to generate an id based on ms elapsed since unix epoch */
export const genTimeBasedID = (prefix/*: ?string */, suffix/*: ?string */)/* : string */ =>
    `${prefix ? prefix + '-' : ''}${Date.now()}${suffix ? suffix + '-': ''}`;

