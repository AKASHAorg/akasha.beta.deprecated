// @flow strict
import { genId } from '../../utils/dataModule';
/* ::
    import type { ActionType } from '../../flow-types/actions/action';
 */
const generateId = () /* : string */ => genId();

export function action (type /*:  string */, payload /*: Object */ = {}) /* : ActionType */ {
    let { reqId = null, ...others } = payload;
    if (!reqId) {
        reqId = generateId();
    }
    // add requestId to payload...
    return {
        type,
        payload: {
            reqId /* : String */,
            ...others
        }
    };
}
