"use strict";
const AbstractEmitter_1 = require('./AbstractEmitter');
const channels_1 = require('../../channels');
const responses_1 = require('./responses');
class ModuleEmitter extends AbstractEmitter_1.AbstractEmitter {
    _manager() {
        this.registerListener(channels_1.default.server[this.MODULE_NAME].manager, (event, data) => {
            if (data.listen) {
                if (this.getListenersCount(data.channel) >= 1) {
                    return this.fireEvent(channels_1.default.client[this.MODULE_NAME].manager, responses_1.mainResponse({ error: { message: `already listening on ${data.channel}` } }), event);
                }
                this.listenEvents(data.channel);
            }
            else {
                this.purgeListener(data.channel);
            }
            return this.fireEvent(channels_1.default.client[this.MODULE_NAME].manager, responses_1.mainResponse(data), event);
        });
        this.listenEvents(channels_1.default.server[this.MODULE_NAME].manager);
        this.DEFAULT_MANAGED.forEach((action) => this.listenEvents(channels_1.default.server[this.MODULE_NAME][action]));
    }
    attachEmitters() {
        return true;
    }
    _initMethods(methods) {
        methods.forEach((method) => {
            this.registerListener(channels_1.default.server[this.MODULE_NAME][method.name], (event, data) => {
                let response;
                method
                    .execute(data)
                    .then((result) => {
                    response = responses_1.mainResponse(result);
                })
                    .catch((err) => {
                    response = responses_1.mainResponse({ error: { message: err.message }, from: data });
                })
                    .finally(() => {
                    this.fireEvent(channels_1.default.client[this.MODULE_NAME][method.name], response, event);
                });
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModuleEmitter;
//# sourceMappingURL=ModuleEmitter.js.map