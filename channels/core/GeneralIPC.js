import ModuleEmitter from './ModuleEmitter';
export default class GeneralIPC extends ModuleEmitter {
    constructor(formatter) {
        super();
        this.addFormatter(formatter);
    }
    registerModuleName(name) {
        this.MODULE_NAME = name;
    }
    registerLogger(logger) {
        this.logger = logger;
    }
    registerDefaultManaged(methods) {
        this.DEFAULT_MANAGED = methods;
    }
    registerMethods(implListener, implRequest, methods) {
        if (!this.MODULE_NAME) {
            this.logger.debug(implListener, implRequest, methods);
            throw new Error('Must register a module namespace before adding methods');
        }
        this.initMethods(implListener, implRequest, methods);
        this.manager();
    }
}
//# sourceMappingURL=GeneralIPC.js.map