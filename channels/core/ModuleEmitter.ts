import getChannels, { registerChannel } from './channels';
import { ApiListener, ApiRequest } from './ipcPreloader';

export default class ModuleEmitter {
  protected MODULE_NAME: string;
  protected DEFAULT_MANAGED: string[] = [];
  protected logger: any = console;
  protected formatMessage: any;

  public addFormatter(formatMessage) {
    this.formatMessage = formatMessage;
  }

  public generateStreamListener(method) {
    return (data: any) => {
      let response: any;
      // console.time(method.name);
      return method
      .execute(data, (er, ev) => {
        if (er) {
          response = this.formatMessage({ error: { message: er } }, data);
        } else {
          response = this.formatMessage(ev, data);
        }
        getChannels().client[this.MODULE_NAME][method.name].send(response);
      })
      .then((result: any) => {
        response = this.formatMessage(result, data);
      })
      .catch((err: Error) => {
        response = this.formatMessage({ error: { message: err.message } }, data);
      })
      .finally(() => {
        getChannels().client[this.MODULE_NAME][method.name].send(response);
        // console.timeEnd(method.name);
        response = null;
      });
    };
  }

  public generateListener(method) {
    return (data: any) => {
      let response: any;
      return method
      .execute(data)
      .then((result: any) => {
        response = this.formatMessage(result, data);
      })
      .catch((err: Error) => {
        console.log(err);
        response = this.formatMessage({ error: { message: err.message } }, data);
      })
      .finally(() => {
        getChannels().client[this.MODULE_NAME][method.name].send(response);
        response = null;
      });
    };
  }

  protected manager() {
    this.DEFAULT_MANAGED.forEach(
      (action: string) => {
        getChannels().server[this.MODULE_NAME][action].enable();
      },
    );
  }

  protected initMethods(
    implListener: ApiListener,
    implRequest: ApiRequest,
    methods,
  ) {
    methods.forEach((method) => {
      registerChannel(implListener, implRequest, this.MODULE_NAME, method.name);
      getChannels()
        .server[this.MODULE_NAME][method.name]
      .registerListener(
        method.hasStream ?
          this.generateStreamListener(method) : this.generateListener(method),
      );
    });
  }
}
