// @flow
import { buildCall } from '@akashaproject/common/constants';
import { put } from 'redux-saga/effects';
import { isEmpty } from 'ramda';
import { genId } from '../../utils/dataModule';
import store from '../store/configureStore';


export default {
    requestIds: {
        // [methodName]: [requestId, requestId...]
    },
    sendRequest (module: Object, methodName: string, data: Object) {
        let { reqId } = data;
        // generate a request id if it's missing
        if(!reqId) {
            reqId = this.generateId();
        }
        const channel = this.getIPCChannel();
        const reqObject = buildCall(module, methodName, { reqId, ...data });

        this.addRequestId(reqId, methodName);
        try {
            channel.send(reqObject);
            store.dispatch({ type: `${methodName}_REQUEST`, data: { methodName, ...reqObject } });
        } catch (ex) {
            store.dispatch({ type: `${methodName}_REQUEST_ERROR`, data: { methodName, ...ex } });
            this.removeRequestId(reqId, methodName);
        }
    },
    generateId (): string {
        return genId();
    },
    getIPCChannel () {
        return global.IPC
    },
    addResponseListener (): void {
        this.getIPCChannel().on((evEmitter: Event/** don't care */, response: Object) => {
            const { data, args, error } = response;
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
                    console.info(`%cDispatching [${action.type}]`, 'color: blue; font-weight: bold', action.data);
                    store.dispatch(action);
            } else {
                console.warn('a request without requestId has been made. Please add a requestId to', module, method);
            }
        });
    },
    processResponse (response: Object) {
        // determine the appropiate action base on requestId and data
        const { args, data, error } = response;
        const { method, payload } = args;
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
