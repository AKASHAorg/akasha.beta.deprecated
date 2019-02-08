// @flow
import { buildCall } from '@akashaproject/common/constants';
import { genId } from '../../utils/dataModule';


export default {
    requestIds: {
        // [reqId]: [ActionType]
    },
    setDispatch (dispatchMethod) {
        this.dispatch = dispatchMethod;
    },
    sendRequest (module/* : Object */, methodName/* : string */, data/* : Object */) {
        let reqId/* : string */ = data.reqId;
        if (!reqId) {
            reqId = this.generateId();
        }
        const channel = this.getIPCChannel();
        const reqObject = buildCall(module, methodName, { reqId, ...data });

        // this.addRequestId(reqId, methodName);
        try {
            channel.send(reqObject);
            // storeConfig.then((config) => {
            //     const store = config.default();
            // });
            this.dispatch({ type: `${methodName}_REQUEST`, data: { methodName, ...reqObject } });
        } catch (ex) {
            // storeConfig.then((config) => {
            //     const store = config.default();
            // });
            this.dispatch({ type: `${methodName}_REQUEST_ERROR`, data: { methodName, ...ex } });
            this.removeRequestId(reqId, methodName);
        }
    },
    generateId (): string {
        return genId();
    },
    setIPCChannel (channel/*: Object */) {
        this.IPC = channel;
    },
    getIPCChannel () {
        return this.IPC
    },
    addResponseListener (): void {
        this.getIPCChannel().on((evEmitter: Event/** don't care */, response: Object) => {
            const { data, args } = response;
            const { method, module, payload } = args;
            const { reqId } = payload;
            if(reqId) {
                if(data && !data.hasStream) {
                    // remove requestId and process data
                    this.removeRequestId(reqId, method);
                }
                // keep the requestId and process data
                const action = this.processAction(response);
                /**
                    * dispatch action
                    * action = { type: String, data: Object }
                    */
                console.info(`%cDispatching [${action.responseAction.type}]`, 'color: blue; font-weight: bold', action.responseAction.data); // eslint-disable-line
                // storeConfig.then((config) => {
                //     const store = config.default();
                // })
                this.dispatch(action.responseAction);
                this.dispatch(action.endAction);
            } else {
                console.warn('a request without requestId has been made. Please add a requestId to', module, method); // eslint-disable-line
            }
        });
    },
    processAction (response/* : Object */) {
        // determine the appropiate action base on requestId and data
        const { args, data, error } = response;
        const { method } = args;
        if(error) {
            return {
                responseAction: {
                    type: `${method}_ERROR`,
                    data: error
                },
                endAction: {
                    type: `${method}_REQUEST_END_ERROR`,
                    data: {
                        actionType: `${method}`
                    }
                }
            };
        }
        return {
            responseAction: {
                type: `${method}_SUCCESS`,
                data
            },
            endAction: {
                type: `${method}_REQUEST_END_SUCCESS`,
                data: {
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
    addRequestId (reqId: String, method: String): void {
        this.requestIds[reqId] = method;
    },
    removeRequestId (reqId: String, method: String): void {
        delete(this.requestIds[reqId]);
    },
};
