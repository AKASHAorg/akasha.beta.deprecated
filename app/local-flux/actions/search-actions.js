import { action } from './helpers';
import * as types from '../constants';

export const searchHandshake = () => action(types.SEARCH_HANDSHAKE);
export const searchHandshakeSuccess = data => action(types.SEARCH_HANDSHAKE_SUCCESS, { data });
export const searchHandshakeError = () => action(types.SEARCH_HANDSHAKE_ERROR);

export const searchMoreQuery = (text, offset) => action(types.SEARCH_MORE_QUERY, { text, offset });
export const searchMoreQuerySuccess = data => action(types.SEARCH_MORE_QUERY_SUCCESS, { data });
export const searchMoreQueryError = error => action(types.SEARCH_MORE_QUERY_ERROR, { error });

export const searchQuery = text => action(types.SEARCH_QUERY, { text });
export const searchQuerySuccess = data => action(types.SEARCH_QUERY_SUCCESS, { data });
export const searchQueryError = error => action(types.SEARCH_QUERY_ERROR, { error });

export const searchResetResults = () => action(types.SEARCH_RESET_RESULTS);
