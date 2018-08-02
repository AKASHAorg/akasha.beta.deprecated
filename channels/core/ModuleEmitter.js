"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const channels_1 = require("./channels");
class ModuleEmitter {
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
                channels_1.default().client[this.MODULE_NAME][method.name].send(response);
            })
                .then((result) => {
                response = this.formatMessage(result, data);
            })
                .catch((err) => {
                response = this.formatMessage({ error: { message: err.message } }, data);
            })
                .finally(() => {
                channels_1.default().client[this.MODULE_NAME][method.name].send(response);
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
                channels_1.default().client[this.MODULE_NAME][method.name].send(response);
                response = null;
            });
        };
    }
    _manager() {
        this.DEFAULT_MANAGED.forEach((action) => {
            channels_1.default().server[this.MODULE_NAME][action].enable();
        });
    }
    _initMethods(implListener, implRequest, methods) {
        methods.forEach((method) => {
            channels_1.registerChannel(implListener, implRequest, this.MODULE_NAME, method.name);
            channels_1.default()
                .server[this.MODULE_NAME][method.name]
                .registerListener(method.hasStream ?
                this.generateStreamListener(method) : this.generateListener(method));
        });
    }
}
exports.default = ModuleEmitter;
//# sourceMappingURL=ModuleEmitter.js.map