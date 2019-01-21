// @flow
import { buildCall } from '@akashaproject/common/constants';
import { genId } from '../../utils/dataModule';
import storeConfig from '../store/configureStore';


export default {
    requestIds: {
        // [methodName]: [requestId, requestId...]
    },
    sendRequest (module/* : Object */, methodName/* : string */, data/* : Object */) {
        let reqId/* : string */ = data.reqId;
        if (!reqId) {
            reqId = this.generateId();
        }
        const channel = this.getIPCChannel();
        const reqObject = buildCall(module, methodName, { reqId, ...data });

        this.addRequestId(reqId, methodName);
        try {
            channel.send(reqObject);
            storeConfig.then((config) => {
                const store = config.default();
                store.dispatch({ type: `${methodName}_REQUEST`, data: { methodName, ...reqObject } });
            });
        } catch (ex) {
            storeConfig.then((config) => {
                const store = config.default();
                store.dispatch({ type: `${methodName}_REQUEST_ERROR`, data: { methodName, ...ex } });
            });
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
                const action = this.processResponse(response);
                /**
                    * dispatch action
                    * action = { type: String, data: Object }
                    */
                console.info(`%cDispatching [${action.type}]`, 'color: blue; font-weight: bold', action.data); // eslint-disable-line
                storeConfig.then((config) => {
                    const store = config.default();
                    store.dispatch(action);
                })
            } else {
                console.warn('a request without requestId has been made. Please add a requestId to', module, method); // eslint-disable-line
            }
        });
    },
    processResponse (response: Object) {
        // determine the appropiate action base on requestId and data
        const { args, data, error } = response;
        const { method } = args;
        if(error) {
            return {
                type: `${method}_ERROR`,
                data: error
            };
        }
        return {
            type: `${method}_SUCCESS`,
            data
        };
    },
    removeResponseListener () {
        // remove response listener and all requestIds
        // usefull to cleanup everything
        this.getIPCChannel().removeAllListeners();
    },
    addRequestId (reqId: String, method: String): void {
        if(!this.requestIds[method]) {
            // initialize array if doesn't exist
            this.requestIds[method] = [];
        }
        this.requestIds[method].push(reqId);
    },
    removeRequestId (reqId: String, method: String): void {
        const idx = this.requestIds[method].indexOf(reqId);
        this.requestIds[method].splice(idx, 1);
    },
};
