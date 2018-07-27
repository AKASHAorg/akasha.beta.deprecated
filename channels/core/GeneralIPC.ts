import ModuleEmitter from './ModuleEmitter';
import { ApiListener, ApiRequest } from './ipcPreloader';

/**
 * General class for Akasha channels architecture
 * @example:
 *      const IpfsIPC = new GeneralIPC(formatter: () => {});
 *      IpfsIPC.registerModuleName('ipfs');
 *
 *      IpfsIPC.registerMethods([
 *      {name: 'startService', execute: ()=> Promise.resolve(true)},
 *      {name: 'stopService', execute: ()=> Promise.resolve(false)},
 *      {name: 'status', execute: ()=> Promise.resolve(2)},
 *      ], ApiListener, ApiRequest);
 *
 *      IpfsIPC.registerDefaultManaged(['startService', 'stopService']);
 *
 */

export default class GeneralIPC extends ModuleEmitter {

  constructor(formatter) {
    super();
    this.addFormatter(formatter);
  }

  // reserve a namespace for module
  registerModuleName(name: string) {
    this.MODULE_NAME = name;
  }

  // can add a custom logger
  registerLogger(logger: any) {
    this.logger = logger;
  }

  // register default enabled channels
  registerDefaultManaged(methods: string[]) {
    this.DEFAULT_MANAGED = methods;
  }

  // implement observable channels for 2-way communication
  registerMethods(
    implListener: ApiListener,
    implRequest: ApiRequest,
    methods,
  ) {
    if (!this.MODULE_NAME) {
      // extra info for debugging
      this.logger.debug(implListener, implRequest, methods);
      throw new Error('Must register a module namespace before adding methods');
    }

    // register each method under @MODULE_NAME namespace
    this._initMethods(
      implListener,
      implRequest,
      methods,
    );

    // enable default methods for module
    this._manager();
  }

}
