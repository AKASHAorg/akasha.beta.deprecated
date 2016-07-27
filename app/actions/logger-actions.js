import { LoggerService } from '../services';
let loggerActions = null;

class LoggerActions {
    constructor (dispatch) {
        if (!loggerActions) {
            loggerActions = this;
        }
        this.dispatch = dispatch;
        this.loggerService = new LoggerService;
        return loggerActions;
    }
    startGethLogger = (options, cb) => {
        this.loggerService.startLogger('gethInfo', options, () => {
            this.loggerService.startGethInfo(cb);
        });
    }
    stopGethLogger = (cb) => {
        this.loggerService.stopGethInfo(cb);
    }
}

export { LoggerActions };
