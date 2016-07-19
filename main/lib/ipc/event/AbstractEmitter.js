"use strict";
class AbstractEmitter {
    fireEvent(channel, data, event) {
        if (event) {
            return event.sender.send(channel, data);
        }
        return this.webContents.send(channel, data);
    }
}
exports.AbstractEmitter = AbstractEmitter;
//# sourceMappingURL=AbstractEmitter.js.map