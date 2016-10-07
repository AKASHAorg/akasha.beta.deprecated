"use strict";
const Logger_1 = require('../lib/ipc/Logger');
exports.initLogger = () => {
    return Logger_1.default.getInstance();
};
exports.fireEvent = (channel, data, event) => {
    return { channel, data, event };
};
//# sourceMappingURL=helpers.js.map