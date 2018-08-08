class GenericApi {
  public channel: string;
  public channelName: string;

  constructor(channel: string, channelName?: string) {
    this.channel = channel;
    this.channelName = channelName;
  }

}
export type listenerType = (event, arg) => {};
export abstract class ApiListener extends GenericApi {
  public pipe: any;
  public subscribers: Map<any, any>;

  protected constructor(channel: string, channelName?: string) {
    super(channel, channelName);
  }
  abstract send(data: {}): any | void;

  abstract on(listener : listenerType);

  abstract once(listener: listenerType);

  abstract removeListener(listener: listenerType);

  abstract removeAllListeners();

  readonly listenerCount: number;
}

export interface ApiRequest{

  enable();

  disable();

  registerListener(listener: (data) => {});
}
