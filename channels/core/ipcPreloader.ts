export class GenericApiClass {
  public channel: string;
  public channelName: string;
}

export class ApiListenerClass extends GenericApiClass {
  public pipe: any;
  public subscribers: Map<any, any>;
}

export interface GenericApi {
  new(channel: string, channelName?: string): GenericApiClass;
}

export interface ApiListener extends GenericApi {
  new(channel: string, channelName?: string): ApiListenerClass;

  send(data: {}): any | void;

  on(listener);

  once(listener);

  removeListener(listener);

  removeAllListeners();

  listenerCount(): number;
}

export interface ApiRequest extends ApiListener {

  enable(): { listening: boolean };

  disable(): { listening: boolean };

  registerListener(listener: (data) => {});
}
