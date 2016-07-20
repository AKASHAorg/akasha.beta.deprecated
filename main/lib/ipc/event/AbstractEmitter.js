"use strict";
const electron_1 = require('electron');
const AbstractListener_1 = require('./AbstractListener');
class AbstractEmitter extends AbstractListener_1.AbstractListener {
    constructor() {
        super();
        this.webContents = electron_1.BrowserWindow.getFocusedWindow().webContents;
        this.initListeners();
    }
    fireEvent(channel, data, event) {
        if (event) {
            return event.sender.send(channel, data);
        }
        return this.webContents.send(channel, data);
    }
}
exports.AbstractEmitter = AbstractEmitter;
//# sourceMappingURL=AbstractEmitter.js.map