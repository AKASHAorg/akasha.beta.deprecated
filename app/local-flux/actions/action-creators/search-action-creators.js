import * as types from '../../constants/SearchConstants';

export function handshake (flags) {
    return {
        type: types.HANDSHAKE,
        flags
    };
}

export function handshakeSuccess (data, flags) {
    return {
        type: types.HANDSHAKE_SUCCESS,
        data,
        flags
    };
}

export function handshakeError (error, flags) {
    error.code = 'HE01';
    return {
        type: types.HANDSHAKE_ERROR,
        error,
        flags
    };
}

export function query (query, flags) {
    return {
        type: types.QUERY,
        query,
        flags
    };
}

export function querySuccess (data, flags) {
    return {
        type: types.QUERY_SUCCESS,
        data,
        flags
    };
}

export function queryError (error, flags) {
    error.code = 'QE01';
    return {
        type: types.QUERY_ERROR,
        error,
        flags
    };
}

export function moreQuery (text, flags) {
    return {
        type: types.MORE_QUERY,
        text,
        flags
    };
}

export function moreQuerySuccess (data, flags) {
    return {
        type: types.MORE_QUERY_SUCCESS,
        data,
        flags
    };
}

export function moreQueryError (error, flags) {
    error.code = 'MQE01';
    return {
        type: types.MORE_QUERY_ERROR,
        error,
        flags
    };
}

export function resetResults () {
    return {
        type: types.RESET_RESULTS
    };
}
