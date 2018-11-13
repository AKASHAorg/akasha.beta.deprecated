import getChannels, { registerChannel } from './channels';
export default class ModuleEmitter {
    constructor() {
        this.DEFAULT_MANAGED = [];
        this.logger = console;
    }
    addFormatter(formatMessage) {
        this.formatMessage = formatMessage;
    }
    generateStreamListener(method) {
        return (data) => {
            let response;
            return method
                .execute(data, (er, ev) => {
                if (er) {
                    response = this.formatMessage({ error: { message: er } }, data);
                }
                else {
                    response = this.formatMessage(ev, data);
                }
                getChannels().client[this.MODULE_NAME][method.name].send(response);
            })
                .then((result) => {
                response = this.formatMessage(result, data);
            })
                .catch((err) => {
                response = this.formatMessage({ error: { message: err.message } }, data);
            })
                .finally(() => {
                getChannels().client[this.MODULE_NAME][method.name].send(response);
                response = null;
            });
        };
    }
    generateListener(method) {
        return (data) => {
            let response;
            return method
                .execute(data)
                .then((result) => {
                response = this.formatMessage(result, data);
            })
                .catch((err) => {
                console.log(err);
                response = this.formatMessage({ error: { message: err.message } }, data);
            })
                .finally(() => {
                getChannels().client[this.MODULE_NAME][method.name].send(response);
                response = null;
            });
        };
    }
    manager() {
        this.DEFAULT_MANAGED.forEach((action) => {
            getChannels().server[this.MODULE_NAME][action].enable();
        });
    }
    initMethods(implListener, implRequest, methods) {
        methods.forEach((method) => {
            registerChannel(implListener, implRequest, this.MODULE_NAME, method.name);
            getChannels()
                .server[this.MODULE_NAME][method.name]
                .registerListener(method.hasStream ?
                this.generateStreamListener(method) : this.generateListener(method));
        });
    }
}
//# sourceMappingURL=ModuleEmitter.js.map