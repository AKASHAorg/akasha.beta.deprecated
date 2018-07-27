class GenericApi {
  public channel: string;
  public channelName: string;

  constructor(channel: string, channelName?: string) {
    this.channel = channel;
    this.channelName = channelName;
  }

}

export abstract class ApiListener extends GenericApi {
  public pipe: any;
  public subscribers: Map<any, any>;

  protected constructor(channel: string, channelName?: string) {
    super(channel, channelName);
  }
  abstract send(data: {}): any | void;

  abstract on(listener);

  abstract once(listener);

  abstract removeListener(listener);

  abstract removeAllListeners();

  readonly listenerCount: number;
}

export abstract class ApiRequest extends ApiListener {

  abstract enable();

  abstract disable();

  abstract registerListener(listener: (data) => {});
}
