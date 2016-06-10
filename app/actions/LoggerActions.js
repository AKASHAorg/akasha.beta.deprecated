import { LoggerService } from '../services';

class LoggerActions {
    constructor (dispatch) {
        this.dispatch = dispatch;
        this.loggerService = new LoggerService;
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
