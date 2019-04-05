// @flow
import { buildCall } from '@akashaproject/common/constants';
import { genId } from '../../utils/dataModule';

export default {
    requestIds: {
        // [reqId]: [ActionType]
    },
    dispatch: null,
    logger: null,
    setDispatch (dispatchMethod /* : void */) /* : void */ {
        this.dispatch = dispatchMethod;
    },
    setLogger (logger /* : Object */) /* : void */ {
        this.logger = logger;
    },
    sendRequest (moduleName /* : Object */, methodName /* : string */, data /* : Object */) {
        let reqId /* : string */ = data.reqId;
        if (!reqId) {
            reqId = this.generateId();
        }
        const channel = this.getIPCChannel();
        const reqObject = buildCall(moduleName, methodName, { reqId, ...data });

        try {
            channel.send(reqObject);
            this.dispatch({ type: `${methodName}_REQUEST`, data: { methodName, ...reqObject } });
        } catch (ex) {
            console.error('exception occured', ex);
            this.dispatch({ type: `${methodName}_REQUEST_ERROR`, data: { methodName, ...ex } });
            this.removeRequestId(reqId, methodName);
        }
    },
    generateId () /* : string */ {
        return genId();
    },
    setIPCChannel (channel /*: Object */) {
        this.IPC = channel;
    },
    getIPCChannel () {
        return this.IPC;
    },
    addResponseListener (): void {
        this.getIPCChannel().on((evEmitter /* : Event */ /** don't care */, response /* : Object */) => {
            const { data, args } = response;
            const { method, module, payload } = args;
            const { reqId } = payload;
            if (reqId) {
                if (data && !data.hasStream) {
                    // remove requestId and process data
                    this.removeRequestId(reqId, method);
                }
                // keep the requestId and process data
                const action = this.processAction(response);
                /**
                 * dispatch action
                 * action = { type: String, data: Object }
                 */
                this.logger.info(
                    { payload: action.responseAction.payload },
                    `[ChReqService] Dispatching [${action.responseAction.type}]`
                );
                this.dispatch(action.responseAction);
                this.dispatch(action.endAction);
            } else {
                this.logger.warn(
                    { module, method },
                    '[ChReqService] A request without requestId has been made'
                );
            }
        });
    },
    processAction (response /* : Object */) {
        // determine the appropiate action base on requestId and data
        const { args, data, error } = response;
        if (error) {
            this.logger.error({ args, error }, `[${args.module}/${args.method}]`);
        }
        const { method } = args;
        if (error) {
            return {
                responseAction: {
                    type: `${method}_ERROR`,
                    payload: { error }
                },
                endAction: {
                    type: `${method}_REQUEST_END_ERROR`,
                    payload: {
                        actionType: `${method}`
                    }
                }
            };
        }
        return {
            responseAction: {
                type: `${method}_SUCCESS`,
                payload: { ...data }
            },
            endAction: {
                type: `${method}_REQUEST_END_SUCCESS`,
                payload: {
                    actionType: `${method}`
                }
            }
        };
    },
    removeResponseListener () {
        // remove response listener and all requestIds
        // usefull to cleanup everything
        this.getIPCChannel().removeAllListeners();
    },
    addRequestId (reqId /* : String */, method /* : String */) /* : void */ {
        this.requestIds[reqId] = method;
    },
    removeRequestId (reqId /* : String */, method /* : String */) /* : void */ {
        delete this.requestIds[reqId];
    }
};
