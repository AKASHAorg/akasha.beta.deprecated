import { LoggerService } from '../services';

let loggerActions = null;

class LoggerActions {
    constructor (dispatch) {
        if (!loggerActions) {
            loggerActions = this;
        }
        this.loggerService = new LoggerService();
        this.dispatch = dispatch;
        return loggerActions;
    }
    startGethLogger = (options, cb) => {
        this.loggerService.startLogger('gethInfo', options, () => {
            this.loggerService.startGethInfo(cb);
        });
    };
    stopGethLogger = (cb) => {
        this.loggerService.stopGethInfo(cb);
    };
}

export { LoggerActions };
