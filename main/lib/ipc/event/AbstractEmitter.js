"use strict";
const AbstractListener_1 = require('./AbstractListener');
class AbstractEmitter extends AbstractListener_1.AbstractListener {
    fireEvent(channel, data, event) {
        if (event) {
            return event.sender.send(channel, data);
        }
        return this.webContents.send(channel, data);
    }
}
exports.AbstractEmitter = AbstractEmitter;
//# sourceMappingURL=AbstractEmitter.js.map