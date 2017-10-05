import { AbstractEmitter } from './AbstractEmitter';
import channels from '../channels';
import { mainResponse } from './responses';

abstract class ModuleEmitter extends AbstractEmitter {
    protected MODULE_NAME: string;
    protected DEFAULT_MANAGED: string[];

    /**
     * @returns {boolean}
     */
    public attachEmitters() {
        return true;
    }

    public generateStreamListener(method) {
        return (event: any, data: any) => {
            let response: any;
            // console.time(method.name);
            method
                .execute(data, (er, ev) => {
                    if (er) {
                        response = mainResponse({ error: (er.hasOwnProperty('message')) ? er : { message: er } }, data);
                    } else {
                        response = mainResponse(ev, data);
                    }
                    this.fireEvent(
                        channels.client[this.MODULE_NAME][method.name],
                        response,
                        event
                    );
                })
                .then((result: any) => {
                    response = mainResponse(result, data);
                })
                .catch((err: Error) => {
                    response = mainResponse({ error: { message: err.message, trace: err } }, data);
                })
                .finally(() => {
                    this.fireEvent(
                        channels.client[this.MODULE_NAME][method.name],
                        response,
                        event
                    );
                    // console.timeEnd(method.name);
                    response = null;
                });
        };
    }

    public generateListener(method) {
        return (event: any, data: any) => {
            let response: any;
            // const stamp = method.name + ' ' + (new Date()).getTime();
            // console.time(stamp);
            method
                .execute(data)
                .then((result: any) => {
                    response = mainResponse(result, data);
                })
                .catch((err: Error) => {
                    response = mainResponse({ error: { message: err.message, trace: err } }, data);
                })
                .finally(() => {
                    this.fireEvent(
                        channels.client[this.MODULE_NAME][method.name],
                        response,
                        event
                    );
                    // console.timeEnd(stamp);
                    response = null;
                });
        };
    }

    /**
     *
     * @private
     */
    protected _manager() {
        this.registerListener(
            channels.server[this.MODULE_NAME].manager,
            (event: any, data: IPCmanager) => {
                if (data.listen) {
                    if (this.getListenersCount(data.channel) >= 1) {
                        return this.fireEvent(
                            channels.client[this.MODULE_NAME].manager,
                            mainResponse({ error: { message: `already listening on ${data.channel}` } }, data),
                            event
                        );
                    }
                    this.listenEvents(data.channel);
                } else {
                    this.purgeListener(data.channel);
                }
                return this.fireEvent(channels.client[this.MODULE_NAME].manager, mainResponse({}, data), event);
            }
        );
        this.listenEvents(channels.server[this.MODULE_NAME].manager);
        this.DEFAULT_MANAGED.forEach(
            (action: string) =>
                this.listenEvents(channels.server[this.MODULE_NAME][action])
        );
    }

    protected _initMethods(methods) {
        methods.forEach((method) => {
            // console.log([this.MODULE_NAME], [method.name]);
            if (method.hasStream) {
                this.registerListener(
                    channels.server[this.MODULE_NAME][method.name],
                    this.generateStreamListener(method)
                );
                return;
            }
            this.registerListener(
                channels.server[this.MODULE_NAME][method.name],
                this.generateListener(method)
            );
        });
    }
}

export default ModuleEmitter;
