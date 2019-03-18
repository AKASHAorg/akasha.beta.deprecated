// @flow
import { genId } from '../../utils/dataModule';

const generateId = (): string => {
    return genId();
};
export function action (type/*:  string */, payload/*: Object */ = {}) {
    let { reqId = null, ...others } = payload;
    if(!reqId) {
        reqId = generateId();
    }
    // add requestId to payload...
    return {
        type,
        payload: {
            reqId,
            ...others
        }
    };
}
